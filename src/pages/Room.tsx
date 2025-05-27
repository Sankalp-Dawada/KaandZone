function Room(){
    return (
        <div>
            <header>Room: Room Name</header>
            <div>edit</div>
            <div>remove players</div>
            <select name="public-or-private" id="pop">
            <option value="public">Public</option>
            <option value="private">Private</option>
            </select>
            <div className="players present in the room">Players List</div>
        </div>
    );
}
export default Room;