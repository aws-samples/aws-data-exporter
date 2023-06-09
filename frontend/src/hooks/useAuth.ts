import { CognitoIdToken } from "amazon-cognito-identity-js";
import { Auth } from "aws-amplify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const KEY_DOWNLOADABLE = "custom:Downloadable";

/**
 * Hooks for authentication
 * @returns
 */
const useAuth = () => {
  const [tokenPayload, setTokenPayload] = useState<CognitoIdToken["payload"]>(
    {}
  );
  const [canExport, setCanExport] = useState(false);
  const navigate = useNavigate();

  // Get payload from ID token in session
  useEffect(() => {
    Auth.currentSession().then((sess) => {
      setTokenPayload(sess.getIdToken().payload);
    });
  }, []);

  // Get attributes and set state
  useEffect(() => {
    setCanExport(tokenPayload[KEY_DOWNLOADABLE] === "true");
  }, [tokenPayload]);

  return {
    canExport,
    signOut: () => {
      return Auth.signOut().then(() => {
        navigate("/");
      });
    },
  };
};

export default useAuth;
