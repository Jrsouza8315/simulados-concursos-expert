
// Mock Supabase client for development without Supabase integration
export interface MockUser {
  id: string;
  email: string;
}

export interface MockUserProfile {
  id: string;
  email: string;
  role: 'admin' | 'assinante' | 'visitante';
  subscription_active?: boolean;
  created_at?: string;
}

// Mock data storage
let mockUsers: MockUserProfile[] = [
  {
    id: '1',
    email: 'admin@example.com',
    role: 'admin',
    subscription_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'assinante@example.com',
    role: 'assinante',
    subscription_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'visitante@example.com',
    role: 'visitante',
    subscription_active: false,
    created_at: new Date().toISOString()
  }
];

let currentUser: MockUser | null = null;

export const mockSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: currentUser ? { user: currentUser } : null }
    }),
    onAuthStateChange: (callback: (event: string, session: any) => void) => ({
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock authentication - check if user exists
      const user = mockUsers.find(u => u.email === email);
      if (user && password === 'password123') {
        currentUser = { id: user.id, email: user.email };
        return { error: null };
      }
      return { error: new Error('Invalid credentials') };
    },
    signUp: async ({ email, password }: { email: string; password: string }) => {
      // Create new user
      const newUser: MockUserProfile = {
        id: Date.now().toString(),
        email,
        role: 'visitante',
        subscription_active: false,
        created_at: new Date().toISOString()
      };
      mockUsers.push(newUser);
      currentUser = { id: newUser.id, email: newUser.email };
      return { error: null };
    },
    signOut: async () => {
      currentUser = null;
      return { error: null };
    },
    resetPasswordForEmail: async (email: string) => {
      console.log('Password reset requested for:', email);
      return { error: null };
    }
  },
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (column: string, value: string) => ({
        single: async () => {
          if (table === 'user_profiles') {
            const user = mockUsers.find(u => u.id === value);
            return { data: user || null, error: null };
          }
          return { data: null, error: null };
        }
      }),
      order: (column: string, options?: any) => ({
        then: async (callback: any) => {
          if (table === 'user_profiles') {
            return callback({ data: mockUsers, error: null });
          }
          return callback({ data: [], error: null });
        }
      }),
      then: async (callback: any) => {
        if (table === 'user_profiles') {
          return callback({ data: mockUsers, error: null });
        }
        return callback({ data: [], error: null });
      }
    }),
    insert: (data: any[]) => ({
      select: () => ({
        single: async () => {
          if (table === 'user_profiles') {
            const newProfile = data[0];
            mockUsers.push(newProfile);
            return { data: newProfile, error: null };
          }
          return { data: null, error: null };
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: string) => ({
        then: async (callback: any) => {
          if (table === 'user_profiles') {
            const userIndex = mockUsers.findIndex(u => u.id === value);
            if (userIndex !== -1) {
              mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
            }
            return callback({ error: null });
          }
          return callback({ error: null });
        }
      })
    })
  })
};
