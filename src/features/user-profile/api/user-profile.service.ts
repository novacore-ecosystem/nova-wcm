import type { UserProfileService } from "@novacore/frontend-next-shadcn";
import { getMockCapabilities, getMockProfile, updateMockProfile } from "@/services/user-profile/user-profile.mock";

/** WCM's adapter over `UserProfileService` — see `services/user-profile/user-profile.mock.ts` for why it's a dev stub, not a real API call. */
export const userProfileService: UserProfileService = {
  getProfile: getMockProfile,
  getCapabilities: getMockCapabilities,
  updateProfile: updateMockProfile,
};
