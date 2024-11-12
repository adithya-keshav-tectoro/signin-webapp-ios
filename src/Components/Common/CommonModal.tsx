import React from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const CommonModal = ({
    show,
    size,
    handleClick,
    onCloseClick,
    cancelText,
    saveText,
    modalheader,
    handleModalBody,
    disabled,
    hideSaveButton,
    hideFooter,
    hideHeader,
    headerCss,
    footerCss,
    customWidth
}: any) => {
    return (
        <Modal
            isOpen={show}
            toggle={onCloseClick}
            centered={true}
            size={size ? size : null}
            className={`${customWidth ? customWidth : ''}`}
        >
            {!hideHeader && (
                <ModalHeader className={`pb-5 border-bottom ${headerCss}`} toggle={onCloseClick}>
                    {modalheader && modalheader}
                </ModalHeader>
            )}
            <ModalBody>{handleModalBody()}</ModalBody>
            {!hideFooter && (
                <ModalFooter className={`border-top ${footerCss}`}>
                    <div className="d-flex gap-2 justify-content-end mt-4 mb-2">
                        <button type="button" className="btn w-sm btn-light" data-bs-dismiss="modal" onClick={onCloseClick}>
                            {cancelText ? cancelText : 'Close'}
                        </button>
                        {!hideSaveButton && (
                            <button type="button" className="btn w-sm btn-success" disabled={disabled} onClick={handleClick}>
                                {saveText ? saveText : 'OK'}
                            </button>
                        )}
                    </div>
                </ModalFooter>
            )}
        </Modal>
    );
};

export default CommonModal;
