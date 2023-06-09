import { Amplify, I18n } from "@aws-amplify/core";
import { Authenticator, translations } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Box, Typography } from "@mui/material";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../../i18n";

type Props = {
  children: React.ReactNode;
};

const SignInPage: React.FC<Props> = ({ children }) => {
  const { t, i18n } = useTranslation();

  Amplify.configure({
    // Cognito info
    Auth: {
      userPoolId: import.meta.env.VITE_AUTH_USER_POOL_ID,
      userPoolWebClientId: import.meta.env.VITE_AUTH_WEB_CLIENT_ID,
      authenticationFlowType: "USER_SRP_AUTH",
    },
  });

  // I18n settings for Amplify UI
  I18n.putVocabularies(translations);
  I18n.setLanguage(i18n.language);

  const AuthHeader = useCallback(
    () => (
      <Typography
        variant="h4"
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          mt: 10,
        }}
      >
        {t("app.name")}
      </Typography>
    ),
    []
  );

  const AuthFooter = useCallback(
    () => (
      <Typography
        variant="body2"
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
        }}
      >
        <Box component="span" sx={{ mr: 1 }}>
          Language:
        </Box>

        {LANGUAGES.map((lang) =>
          lang === i18n.language ? (
            t(`app.language.${lang}`)
          ) : (
            <a key={lang} href={`?lng=${lang}`}>
              {t(`app.language.${lang}`)}
            </a>
          )
        ).map((item, index) => (
          <React.Fragment key={index}>
            {item}
            {index < LANGUAGES.length - 1 ? (
              <Box component="span" sx={{ mx: 1 }}>
                /
              </Box>
            ) : null}
          </React.Fragment>
        ))}
      </Typography>
    ),
    []
  );
  return (
    <Authenticator
      className="authenticator"
      loginMechanisms={["email"]}
      hideSignUp={true}
      components={{
        Header: AuthHeader,
        Footer: AuthFooter,
      }}
    >
      {/* Display children components after user is authenticated */}
      {children}
    </Authenticator>
  );
};

export default SignInPage;
