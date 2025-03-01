import initialiseLogin from "./strategies/initialiseLogin.js";
import initialiseSignUp from "./strategies/initialiseSignUp.js";

const initialisePassport = () => {
    initialiseSignUp();
    initialiseLogin();
};

export default initialisePassport;