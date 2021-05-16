import auth from "../lib/auth";

const Profile = ({ user }) => {
    if (!user)
        return (
            <div>
                <h2>not logged in</h2>
            </div>
        );

    console.log({ user });

    return (
        <main>
            <ul>
                <li>{user.displayName}</li>
                <li>{user.email}</li>
                <li>{user.uid}</li>
                {user.photoURL && (
                    <li>
                        <img src={user.photoURL} alt="user's profile pic" />
                    </li>
                )}
            </ul>
            <button onClick={() => auth.signOut()}>sign out</button>
        </main>
    );
};

Profile.pageName = "Profile";

export default Profile;
