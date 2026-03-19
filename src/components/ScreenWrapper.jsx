import React from 'react'

/**
 * Wrapper that extracts ONLY the inner content div from components
 * Completely removes the outer div (min-h-screen with bg-[#E5E5E5])
 */
export function ScreenWrapper({ children }) {
  // If it's a Fragment, extract the actual content
  if (React.isValidElement(children) && children.type === React.Fragment) {
    const fragmentChildren = React.Children.toArray(children.props.children);
    
    // Find GlobalStyles (keep it)
    const globalStyles = fragmentChildren.find(
      child => React.isValidElement(child) && 
      (typeof child.type === 'function' || child.type === 'style')
    );
    
    // Find the outer container div with min-h-screen (this is the BACKGROUND frame we want to remove)
    const outerDiv = fragmentChildren.find(
      child => React.isValidElement(child) && 
      child.props?.className?.includes('min-h-screen')
    );
    
    if (outerDiv && React.isValidElement(outerDiv) && outerDiv.props?.children) {
      // Get the inner frame div (w-[390px] h-[844px]) - THIS is what we want to keep
      const innerDiv = outerDiv.props.children;
      
      if (React.isValidElement(innerDiv)) {
        // Clone inner div and modify classes - keep it simple
        const className = innerDiv.props.className || '';
        // Replace frame classes with full width/height
        let modifiedClassName = className
          .replace(/w-\[390px\]/g, 'w-full')
          .replace(/h-\[844px\]/g, 'h-full')
          .replace(/rounded-\[55px\]/g, 'rounded-none')
          .replace(/shadow-\[[^\]]+\]/g, '');
        
        // Ensure w-full and h-full are present
        if (!modifiedClassName.includes('w-full')) {
          modifiedClassName = 'w-full ' + modifiedClassName;
        }
        if (!modifiedClassName.includes('h-full')) {
          modifiedClassName = 'h-full ' + modifiedClassName;
        }
        
        // Clone with modified props - keep original children
        const modifiedInner = React.cloneElement(innerDiv, {
          ...innerDiv.props,
          className: modifiedClassName.trim(),
          style: {
            ...innerDiv.props.style,
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            borderRadius: 0,
            boxShadow: 'none',
          }
        });
        
        // Return GlobalStyles + modified inner div (WITHOUT the outer div!)
        return (
          <>
            {globalStyles}
            {modifiedInner}
          </>
        );
      }
    }
    
    // Fallback: if we can't find outer div, just return everything (better than blank)
    return <>{fragmentChildren}</>;
  }
  
  return <>{children}</>;
}

