import React, { useState, useCallback, useMemo, FC } from 'react';
import { uniqueID } from '../Util';
import ReactTooltip from 'react-tooltip';

interface EllipsisToolTipProps {
    style?: any;
    options?: any;
    children: any;
    target?: any;
}

const EllipsisToolTip: FC<EllipsisToolTipProps> = (props) => {
    // TOOL TIP STATE
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    // GENERATING - RANDOM ID
    const tid = useMemo(() => uniqueID(5), []);

    // MOUSE ENTER HANDLER
    const mouseEnterHandler = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (e.currentTarget.offsetWidth !== e.currentTarget.scrollWidth && !showTooltip) {
                setShowTooltip(true);
            } else if (e.currentTarget.offsetWidth === e.currentTarget.scrollWidth && showTooltip) {
                setShowTooltip(false);
            }
        },
        [showTooltip, setShowTooltip]
    );

    return (
        <React.Fragment>
            <div data-tip data-for={tid} className="word-ellipsis" onMouseEnter={mouseEnterHandler} style={props.style}>
                {props.children}
            </div>
            {showTooltip && (
                <ReactTooltip id={tid} className="custom-tooltip" effect="solid" {...props.options}>
                    {props.children}
                </ReactTooltip>
            )}
        </React.Fragment>
    );
};

export default EllipsisToolTip;
