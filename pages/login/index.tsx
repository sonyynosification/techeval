import React from 'react';
import firebase from '../../firebase-config';
import {getAuth, getRedirectResult, GithubAuthProvider, signInWithPopup, signInWithRedirect} from "@firebase/auth";
import {useRouter} from "next/router";
import {redirect} from "next/navigation";

const provider = new GithubAuthProvider();
provider.setCustomParameters({
  'allow_signup': 'true'
})
const auth = getAuth(firebase);

function Login() {
  const router = useRouter();
  const {query} = router;
  const {redirectUri = '/'} = query;

  return (
    <div>
      <h1>Login</h1>
      <button onClick={async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        const user = result.user;
        // This gives you a Facebook Access Token.
        const accessToken = user.accessToken;
        document.cookie = `accessToken=${accessToken}; path=/`;
        await router.push(redirectUri)
      }}
      >Login with Github
      </button>
    </div>
  );
}


export default Login;
