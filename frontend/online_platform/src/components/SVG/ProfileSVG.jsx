function ProfileSVG(params) {
    const {classes} = params;

    return (
        <svg viewBox="0 0 35 35" width="35" height="35" className={classes}>
            <defs>
                <image width="35" height="35" id="img1"
                       href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAMAAAApB0NrAAAAAXNSR0IB2cksfwAAAFFQTFRF5ubm5eXl5OTk7Ozs8fHx9PT08vLy7e3t8PDw////+Pj4/v7++vr69vb24+Pj7u7u+fn5+/v75+fn6urq6+vr6enp/f399fX1/Pz86Ojo7+/vSr+j3QAAASVJREFUeJzFU8tigzAMi0wZDVlXKNAH//+hs/MOCbvOkBywkBXZUaoONL4dk5AX8Qv+EQOAeP2BYUh36b8GQJ1goOiqXVyojeEqI6eNfb6lYIOHbpx0YfT4o+oAdcJg7OL9Tqh5aIo0QjRTqgUfSuksGP3IUiGWjEZAXd1arAeeoaHnkfOw6K3lz7PkaflDr+JcN2r4A+SCtELSg3hCVm0slewDZZmcanl7zHM9mWnQNnrMtFExEbEUxtB1Bo5A7TMW60q0Ry9Hzdbm0kO9wqUDifoU3XIWfdL5rdzZ/Rzmx5LOVGB2b03WC1577IfQ6DSDbtldU+KhvVLjyHaK/vCYNmvpiYI/0k1TaNbBq3gbfTNrHiMeOYy9nm3Mlbwe6k8xvQj6BTy8FP4QYdhcAAAAAElFTkSuQmCC"/>
            </defs>
            <style>
            </style>
            <use id="Background" href="#img1" x="0" y="0"/>
        </svg>
    );
}

export default ProfileSVG;