import initialiseSignUp from "./strategies/initialiseSignUp";
import initialiseLogin from "./strategies/initialiseLogin";
import initaliseGoogleLogin from "./strategies/initialiseGoogle";

const initialisePassport = (): void => {
  initialiseSignUp();
  initialiseLogin();
  initaliseGoogleLogin();
}

export default initialisePassport;