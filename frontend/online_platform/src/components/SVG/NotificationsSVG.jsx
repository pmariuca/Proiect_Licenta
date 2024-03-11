function NotificationsSVG(params) {
    const {color} = params;

    return (
        <svg fill={color} width="20px" height="20px" viewBox="-3 -2 24 24">
            <path
                d='M18 17H0a8.978 8.978 0 0 1 3-6.708V6a6 6 0 1 1 12 0v4.292A8.978 8.978 0 0 1 18 17zM6.17 18h5.66a3.001 3.001 0 0 1-5.66 0z'/>
        </svg>
    );
}

export default NotificationsSVG;