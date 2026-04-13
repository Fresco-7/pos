'use client';

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: any;
  isLoading?: boolean;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  isLoading,
  disabled,
  secondaryAction,
  secondaryActionLabel
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300)
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>

      <div
        className="
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-hidden 
          fixed 
          inset-0 
          outline-none 
          focus:outline-none
          bg-neutral-800/70
          dark:bg-muted/40
        "
        style={{ zIndex: 100 }}
      >
        <div className="
          relative 
          w-full
          md:w-5/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto 
          h-screen 
          lg:h-auto
          md:h-auto
          "
        >

          {/*content*/}
          <div className={`
            translate
            duration-300
            h-full
            ${showModal ? 'translate-y-0' : 'translate-y-full'}
            ${showModal ? 'opacity-100' : 'opacity-0'}
          `}>
            <div className="
              translate
              h-full
              lg:h-auto
              md:h-auto
              border-0 
              rounded-xl 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-full 
              bg-card

            "
            >
              {/*header*/}
              <div className="
                flex 
                items-center 
                p-6
                rounded-t
                justify-center
                relative

                "
              >

                <button
                  className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                    absolute
                    left-9
                  "
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">
                  {title}
                </div>
              </div>

              {/*body*/}
              <div className="relative p-6 pb-0 flex-auto ">
                {body}
              </div>
              {/*footer*/}
              <div className="flex flex-col gap-2 p-6 pt-1">
                <div
                  className="
                    flex 
                    flex-row 
                    items-center 
                    gap-4 
                    w-full
                  "
                >
                  {secondaryAction && secondaryActionLabel && (
                    <Button className=""
                      isLoading={isLoading}
                      disabled={disabled}
                      variant={'outline'}
                      onClick={handleSecondaryAction}
                    >{secondaryActionLabel}</Button>
                  )}
                  {actionLabel != undefined && (
                    <Button className="w-full"
                      isLoading={isLoading}
                      disabled={disabled}
                      onClick={handleSubmit}
                    >{actionLabel} </Button>
                  )}
                </div>
                {footer != undefined && (<span className={`${actionLabel != '' ? 'mt-3' : ""}`} ><hr />  </span>)}
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;