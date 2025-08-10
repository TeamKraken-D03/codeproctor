import { createContext } from "react";
import { user} from "@/types/types"

// Define the proper type for your context
interface UserContextType {
  getData: () => Promise<user[]>;
}

export const userContext = createContext<UserContextType | undefined>(undefined);