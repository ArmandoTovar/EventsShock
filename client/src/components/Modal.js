// -----------IMPORTS-----------------------------------------------------------
import React, {
  useEffect,
  useImperativeHandle,
  useState,
  forwardRef,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
// ----------------------------------------------------------------------

const modalElement = document.getElementById('modal-root');
// ----------------------------------------------------------------------

export function Modal({ children, fade = true, defaultOpened = false }, ref) {
  const [isOpen, setIsOpen] = useState(defaultOpened);

  const close = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        setIsOpen(true);
      },
      close,
    }),
    [close],
  );

  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) close();
    },
    [close],
  );

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleEscape, false);
    return () => {
      document.removeEventListener('keydown', handleEscape, false);
    };
  }, [handleEscape, isOpen]);

  return createPortal(
    isOpen ? (
      <div
        className={
          ' modal-backdrop modal ' +
          (isOpen ? `${fade ? 'fade ' : ''} d-block show` : '')
        }
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content bg-dark text-light  text-center   ">
            {children}
          </div>
        </div>
      </div>
    ) : null,
    modalElement,
  );
}

export default forwardRef(Modal);
