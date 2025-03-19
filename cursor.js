// Custom cursor implementation

document.addEventListener('DOMContentLoaded', function() {
    // Only show custom cursor on desktop
    if (window.innerWidth < 768) {
        return;
    }
    
    const cursor = document.getElementById('custom-cursor');
    const cursorDot = document.getElementById('cursor-dot');
    
    if (!cursor || !cursorDot) return;
    
    let isVisible = false;
    let isClicking = false;
    
    // SVG for dumbbell cursor
    cursor.innerHTML = `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.5 6.5h11m-11 11h11M18 4v16M6 4v16M2 8v8M22 8v8" 
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    // Update cursor position
    const updatePosition = (e) => {
        if (!isVisible) {
            cursor.style.display = 'block';
            cursorDot.style.display = 'block';
            isVisible = true;
        }
        
        // Position the cursor elements
        cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px) scale(${isClicking ? 0.8 : 1})`;
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) scale(${isClicking ? 3 : 1})`;
    };
    
    // Handle mouse events
    const handleMouseDown = () => {
        isClicking = true;
        cursor.style.transform = `translate(${parseInt(cursor.style.transform.split('(')[1]) - 16}px, ${parseInt(cursor.style.transform.split(',')[1]) - 16}px) scale(0.8)`;
        cursorDot.style.transform = `translate(${parseInt(cursorDot.style.transform.split('(')[1])}px, ${parseInt(cursorDot.style.transform.split(',')[1])}px) scale(3)`;
    };
    
    const handleMouseUp = () => {
        isClicking = false;
        cursor.style.transform = `translate(${parseInt(cursor.style.transform.split('(')[1]) - 16}px, ${parseInt(cursor.style.transform.split(',')[1]) - 16}px) scale(1)`;
        cursorDot.style.transform = `translate(${parseInt(cursorDot.style.transform.split('(')[1])}px, ${parseInt(cursorDot.style.transform.split(',')[1])}px) scale(1)`;
    };
    
    const handleMouseLeave = () => {
        isVisible = false;
        cursor.style.display = 'none';
        cursorDot.style.display = 'none';
    };
    
    const handleMouseEnter = () => {
        isVisible = true;
        cursor.style.display = 'block';
        cursorDot.style.display = 'block';
    };
    
    // Add event listeners
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
});