import Link from 'next/link';
import { useRouter } from 'next/router';
import useLocalStorage from '../../functions/useLocalStorage';

export default function Header() {
  const [auth, setAuth] = useLocalStorage('auth', { email: null, authkey: null });
  const [prefs] = useLocalStorage('prefs', {
    first_name: null,
    last_name: null,
    date_created: null,
    last_login: null,
    isClient: null,
    isAdmin: null,
    circle_colors: null,
    circle_rank: null,
    notify_time: null,
    avatar: null,
  });
  const router = useRouter();

  function logout() {
    setAuth({
      email: null,
      authkey: null,
    });
    router.push('/');
  }

  return (
    <>
      <div className="header">
        {auth.email != null ? (
          <Link href="/profile">
            <p className="header-email">{auth.email}</p>
          </Link>
        ) : <></>}
        <div className="header-container">
          <Link href="/">
            <div className="header-button">Home</div>
          </Link>
          {prefs.isAdmin ? (
            <Link href="/adminPanel">
              <p className="header-button"> Admin Panel</p>
            </Link>
          ) : <></>}
          {auth.email != null ? (
            <>
              <Link href="/profile">
                <div className="header-button">Profile</div>
              </Link>
              <Link href="/domains">
                <div className="header-button">My Domains</div>
              </Link>
            </>
          ) : <></>}
          <Link href="/crisis">
            <div className="header-button">Are You In Crisis?</div>
          </Link>
          <Link href="/information">
            <div className="header-button">Information</div>
          </Link>
          <Link href="/contact">
            <div className="header-button">Contact Therapist</div>
          </Link>
          {auth.email == null ? (
            <>
              <Link href="/login">
                <div className="header-button">Login</div>
              </Link>
              <Link href="/signup">
                <div className="header-button">Sign Up</div>
              </Link>
            </>
          ) : (
            <>
              <div role="button" tabIndex={0} className="header-button" onClick={() => logout()} onKeyDown={() => logout()}>
                Logout
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
