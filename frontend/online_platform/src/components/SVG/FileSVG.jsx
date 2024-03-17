function FileSVG(params) {
    const {classes} = params;
    return (
        <svg viewBox="0 0 48 48" width="18px" height="18px" fill="#000000" className={classes}>
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <defs>
                    <style>
                        {`.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}`}
                    </style>
                </defs>
                <path className="a"
                      d="M39.5,15.5h-9a2,2,0,0,1-2-2v-9h-18a2,2,0,0,0-2,2v35a2,2,0,0,0,2,2h27a2,2,0,0,0,2-2Z"></path>
                <line className="a" x1="28.5" y1="4.5" x2="39.5" y2="15.5"></line>
            </g>
        </svg>
    )
}

export default FileSVG;