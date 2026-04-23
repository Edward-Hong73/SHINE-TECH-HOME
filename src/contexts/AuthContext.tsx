import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { requestFcmToken, messaging } from '../lib/firebase';
import { onMessage } from 'firebase/messaging';

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  isLoading: boolean; // 추가: 로딩 상태
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // 기본값 true

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('shine_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          
          // DB에서 최신 정보를 한 번 더 가져옵니다.
          const { data, error } = await supabase
            .from('members_shine')
            .select('*')
            .eq('email', parsedUser.email)
            .single();
          
          if (data && !error) {
            const latestUser = {
              id: data.id,
              name: data.name,
              email: data.email,
              company: data.company_name,
              businessNumber: data.business_number,
              role: data.role
            };
            setUser(latestUser);
            setIsLoggedIn(true);
            localStorage.setItem('shine_user', JSON.stringify(latestUser));
          } else {
            setUser(parsedUser);
            setIsLoggedIn(true);
          }
        } catch (e) {
          console.error('Session init error:', e);
        }
      }
      setIsLoading(false); // 확인 끝!
    };
    initAuth();
  }, []);

  // FCM 로직 (이전과 동일)
  useEffect(() => {
    const registerToken = async () => {
      if (!isLoggedIn || !user?.email) return;

      let currentUserId = user?.id || user?.user_id;

      if (!currentUserId) {
        const { data } = await supabase
          .from('members_shine')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (data) {
          currentUserId = data.id;
        } else {
          return;
        }
      }

      try {
        const token = await requestFcmToken();
        if (!token) return;
        
        await supabase
          .from('fcm_tokens')
          .upsert({ 
            user_id: currentUserId, 
            token: token,
            device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
          }, { onConflict: 'token' });
      } catch (e) {
        console.error('FCM 프로세스 에러:', e);
      }
    };

    registerToken();

    const unsubscribe = onMessage(messaging, (payload) => {
      setTimeout(() => {
        alert(`🔔 [실시간 주문 알림]\n\n제목: ${payload.notification?.title}\n내용: ${payload.notification?.body}`);
      }, 100);
    });

    return () => unsubscribe();
  }, [isLoggedIn, user?.email, user?.id]);

  const login = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('shine_user', JSON.stringify(userData));
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('shine_user');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
