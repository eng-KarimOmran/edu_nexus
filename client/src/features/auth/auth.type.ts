import type { UserProfile } from "../user/user.type"


export interface AuthRefresh {
  user: UserProfile,
  tokens: {
    refresh: string,
  }
}

export interface AuthLogin extends AuthRefresh {
  tokens: {
    refresh: string,
  }
}