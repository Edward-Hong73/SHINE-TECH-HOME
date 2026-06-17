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

  // FCM 로직
  useEffect(() => {
    if (!isLoggedIn || !user?.email) return;

    let cancelled = false;

    const registerToken = async () => {
      let currentUserId = user?.id || user?.user_id;

      if (!currentUserId) {
        const { data } = await supabase
          .from('members_shine')
          .select('id')
          .eq('email', user.email)
          .single();
        if (data) currentUserId = data.id;
        else return;
      }

      try {
        const token = await requestFcmToken();
        if (!token || cancelled) return;

        const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

        // 이미 동일 토큰이 있으면 중복 삽입 방지
        const { data: existing } = await supabase
          .from('fcm_tokens')
          .select('id')
          .eq('user_id', currentUserId)
          .eq('token', token)
          .maybeSingle();

        if (!existing) {
          // 이 user의 같은 device_type 토큰 모두 삭제 후 새 토큰 삽입
          await supabase.from('fcm_tokens').delete()
            .eq('user_id', currentUserId)
            .eq('device_type', deviceType);
          if (!cancelled) {
            await supabase.from('fcm_tokens').insert({
              user_id: currentUserId,
              token: token,
              device_type: deviceType,
            });
            console.log('FCM: 토큰 저장 완료');
          }
        }
      } catch (e) {
        console.error('FCM 프로세스 에러:', e);
      }
    };

    registerToken();

    if (!messaging) return;
    const unsubscribe = onMessage(messaging, (payload) => {
      setTimeout(() => {
        const title = payload.data?.title || payload.notification?.title || '샤인테크 알림';
        const body = payload.data?.body || payload.notification?.body || '';
        alert(`🔔 [실시간 주문 알림]\n\n제목: ${title}\n내용: ${body}`);
      }, 100);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [isLoggedIn, user?.email]);

  const login = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('shine_user', JSON.stringify(userData));
    setIsLoading(false);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem('shine_user');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
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
