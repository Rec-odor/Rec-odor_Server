const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
const userProvider = require("./userProvider");
const secret = require("../../../config/secret");

passport.use(
  "kakao-login",
  new KakaoStrategy(
    {
      clientID: secret.KAKAO_API_KEY,
      prompt: "login",
      callbackURL: secret.REDIRECT_URI,
      clientSecret: secret.CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      const userToken = {
        id: profile.id, // 카카오 계정 식별 아이디 (10자리 숫자)
        accessToken: accessToken || "",
      };
      return done(null, userToken);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log('deserialize');
  userProvider
    .retrieveUser(user.id)
    .then((result) => {
      done(null, user);
    })
    .catch((error) => done(error));
});
