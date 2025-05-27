import { useEffect, useState } from "react";
import Header from "../components/Header";
import { db } from "../services/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "../styles/Profile.css";

interface Room {
    id: string;
    roomname: string;
    gameType: string;
    numberOfPlayers: number;
    createdBy: string;
    createdAt: string;
    visibility?: string;
}

interface User {
    username: string;
    email?: string;
    roomId: string[];
    gameType: string[];
    isHost: boolean;
}

function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [userRooms, setUserRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const username = localStorage.getItem("username");
                const adminStatus = localStorage.getItem("isAdmin");

                setIsAdmin(adminStatus === "true");

                if (username) {
                    const userRef = doc(db, "users", username);
                    const userSnap = await getDoc(userRef);

                    if (userSnap.exists()) {
                        const userData = userSnap.data() as User;
                        setUser(userData);
                        const roomsQuery = query(
                            collection(db, "rooms"),
                            where("createdBy", "==", username)
                        );
                        const roomsSnapshot = await getDocs(roomsQuery);
                        const rooms: Room[] = [];
                        roomsSnapshot.forEach((doc) => {
                            rooms.push({
                                id: doc.id,
                                ...doc.data()
                            } as Room);
                        });
                        setUserRooms(rooms);
                    }
                } else if (isAdmin) {
                    const adminRef = doc(db, "AdminLogin", "SankalpDawada");
                    const adminSnap = await getDoc(adminRef);
                    if (adminSnap.exists()) {
                        const adminData = adminSnap.data();
                        setUser({
                            username: "Admin",
                            email: adminData.Email,
                            roomId: [],
                            gameType: [],
                            isHost: true
                        });
                        const allRoomsSnapshot = await getDocs(collection(db, "rooms"));
                        const rooms: Room[] = [];
                        allRoomsSnapshot.forEach((doc) => {
                            rooms.push({
                                id: doc.id,
                                ...doc.data()
                            } as Room);
                        });
                        setUserRooms(rooms);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);
    const handleRoomClick = (roomId: string) => {
        localStorage.setItem("roomname", roomId);
        window.location.href = "/room";
    };
    if (loading) {
        return (
            <>
                <Header />
                <div className="background-effects">
                    <div className="grid-overlay"></div>
                </div>
                <div className="content-wrapper">
                    <div>Loading profile...</div>
                </div>
            </>
        );
    }
    if (!user) {
        return (
            <>
                <Header />
                <div className="background-effects">
                    <div className="grid-overlay"></div>
                </div>
                <div className="content-wrapper">
                    <div>Please login to view profile</div>
                </div>
            </>
        );
    }
    return (
        <>
            <Header />
            <div className="background-effects">
                <div className="grid-overlay"></div>
            </div>
            <div className="content-wrapper">
                <div className="profile-container">
                    <h1>Profile</h1>
                    <div className="profile-info">
                        <div className="profile-field">
                            <strong>Name:</strong> {user.username}
                        </div>
                        {isAdmin && user.email && (
                            <div className="profile-field">
                                <strong>Email:</strong> {user.email}
                            </div>
                        )}
                        <div className="profile-field">
                            <strong>Rank:</strong> {isAdmin ? "Admin" : "Player"}
                        </div>
                    </div>
                    <div className="rooms-section">
                        <h2>Your Rooms</h2>
                        {userRooms.length > 0 ? (
                            <div className="rooms-grid">
                                {userRooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="room-card"
                                        onClick={() => handleRoomClick(room.id)}
                                    >
                                        <h3>{room.roomname}</h3>
                                        <p><strong>Game:</strong> {room.gameType}</p>
                                        <p><strong>Players:</strong> {room.numberOfPlayers}</p>
                                        <p><strong>Created:</strong> {new Date(room.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Visibility:</strong> {room.visibility || "Public"}</p>
                                        <p><strong>Room ID:</strong> {room.id}</p>
                                        <button className="join-room-btn">
                                            {isAdmin ? "Manage Room" : "Enter Room"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No rooms created yet</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile;