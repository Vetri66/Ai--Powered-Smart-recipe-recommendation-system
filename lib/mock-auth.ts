"use client"

interface MockUser {
  id: string
  email: string
  created_at: string
}

class MockAuth {
  private user: MockUser | null = null

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    // Mock successful login
    this.user = {
      id: 'mock-user-' + Date.now(),
      email,
      created_at: new Date().toISOString()
    }
    localStorage.setItem('mock-user', JSON.stringify(this.user))
    return { error: null }
  }

  async signUp({ email, password }: { email: string; password: string; options?: any }) {
    // Mock successful signup
    this.user = {
      id: 'mock-user-' + Date.now(),
      email,
      created_at: new Date().toISOString()
    }
    localStorage.setItem('mock-user', JSON.stringify(this.user))
    return { error: null }
  }

  async signInWithOtp({ email }: { email: string; options?: any }) {
    // Mock magic link
    return { error: null }
  }

  async signOut() {
    this.user = null
    localStorage.removeItem('mock-user')
    return { error: null }
  }

  async getSession() {
    const stored = localStorage.getItem('mock-user')
    if (stored) {
      this.user = JSON.parse(stored)
      return { data: { session: { user: this.user } } }
    }
    return { data: { session: null } }
  }

  async getUser() {
    const stored = localStorage.getItem('mock-user')
    if (stored) {
      this.user = JSON.parse(stored)
      return { data: { user: this.user }, error: null }
    }
    return { data: { user: null }, error: null }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Mock auth state listener
    return { data: { subscription: { unsubscribe: () => {} } } }
  }

  async resetPasswordForEmail(email: string, options?: any) {
    return { error: null }
  }
}

export const mockSupabase = {
  auth: new MockAuth()
}