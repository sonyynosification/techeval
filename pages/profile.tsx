import firebaseAdmin from "../firebase-admin";
import {InferGetStaticPropsType} from "next";

export default function ProfilePage(
  props: InferGetStaticPropsType<typeof getServerSideProps>
) {
  const {user} = props;
  const logout = () => {
    document.cookie = `accessToken=;`;
    window.location.href = '/login';
  }
  return (
    <div>
      <h1>Profile</h1>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <img src={user.picture} alt={user.name}/>
      <p>
        <button onClick={logout}>Logout</button>
      </p>
    </div>
  );
}

export async function getServerSideProps(context) {

  const {req, res} = context;

  const token = req.cookies.accessToken;
  if (!token) {
    // redirect to login page
    res.writeHead(302, {Location: '/login?redirectUri=/profile'});
    res.end();
    return {
      props: {}
    };
  }
  try {
    const authRes = await firebaseAdmin.auth().verifyIdToken(token);
    console.log(authRes);
    const {uid, email, name, picture} = authRes;
    return {
      props: {
        user: {
          uid,
          email,
          name,
          picture,
        }
      }
    }
  } catch (e) {
    console.log(e);
    // redirect to login page
    res.setHeader('Set-Cookie', `accessToken=;`);
    res.writeHead(302, {Location: '/login?redirectUri=/profile'});
    res.end();
    return {
      props: {}
    };
  }

}