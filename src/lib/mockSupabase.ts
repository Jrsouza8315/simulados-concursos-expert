// Mock Supabase client for development without Supabase integration
export interface MockUser {
  id: string;
  email: string;
}

export interface MockUserProfile {
  id: string;
  email: string;
  role: "admin" | "assinante" | "visitante";
  subscription_active?: boolean;
  created_at?: string;
}

// Mock data storage
let mockUsers: MockUserProfile[] = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    subscription_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "assinante@example.com",
    role: "assinante",
    subscription_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    email: "visitante@example.com",
    role: "visitante",
    subscription_active: false,
    created_at: new Date().toISOString(),
  },
];

let currentUser: MockUser | null = null;

export const mockSupabase = {
  auth: {
    getSession: async () => ({
      data: { session: currentUser ? { user: currentUser } : null },
    }),
    onAuthStateChange: (_callback: (event: string, session: any) => void) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    signInWithPassword: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      // Mock authentication - check if user exists
      const user = mockUsers.find((u) => u.email === email);
      if (user && password === "password123") {
        currentUser = { id: user.id, email: user.email };
        return { error: null };
      }
      return { error: new Error("Invalid credentials") };
    },
    signUp: async ({ email }: { email: string; password: string }) => {
      return {
        data: { user: { id: "1", email } },
        error: null,
      };
    },
    signOut: async () => {
      currentUser = null;
      return { error: null };
    },
    resetPasswordForEmail: async (email: string) => {
      console.log("Password reset requested for:", email);
      return { error: null };
    },
  },
  from: (table: string) => ({
    select: (_columns: string) => ({
      eq: (_column: string, value: string) => ({
        single: async () => {
          if (table === "user_profiles") {
            const user = mockUsers.find((u) => u.id === value);
            return { data: user || null, error: null };
          }
          return { data: null, error: null };
        },
      }),
      order: (_column: string, _options?: any) => {
        if (table === "user_profiles") {
          return Promise.resolve({ data: mockUsers, error: null });
        }
        return Promise.resolve({ data: [], error: null });
      },
    }),
    insert: (data: any[]) => ({
      select: () => ({
        eq: () => ({
          single: async () => {
            if (table === "user_profiles") {
              const newProfile = data[0];
              mockUsers.push(newProfile);
              return { data: newProfile, error: null };
            }
            return { data: null, error: null };
          },
        }),
      }),
    }),
    update: (data: any) => ({
      eq: (_column: string, value: string) => {
        if (table === "user_profiles") {
          const userIndex = mockUsers.findIndex((u) => u.id === value);
          if (userIndex !== -1) {
            mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
          }
          return Promise.resolve({ error: null });
        }
        return Promise.resolve({ error: null });
      },
    }),
  }),
};
