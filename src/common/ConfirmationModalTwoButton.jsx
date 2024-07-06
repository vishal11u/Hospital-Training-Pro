import React from "react";
import { Box, Button, Modal } from "@mui/material";
import CommonButton from "./commonbutton/CommonButton";

export default function ConfirmationModalTwoButton({
  confirmationOpen,
  confirmationHandleClose,
  firstSubmitFunc,
  firstButtonMsg,
  secondSubmitFunc,
  secondButtonMsg,
  confirmationMsg,
  confirmationLabel,
}) {
  return (
    <div>
      <Modal
        open={confirmationOpen}
        onClose={confirmationHandleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #848211",
            borderRadius: "0.5rem",
            boxShadow: 24,
            px: 4,
            pb: 4,
          }}
        >
          <p className="my-3 tracking-wide font-bold  text-lg ">
            {confirmationLabel}
          </p>
          <div className=" justify-center align-middle">
            <p className="my-3 tracking-wide text-lg">{confirmationMsg}</p>
            <div className="mt-4 flex  justify-center space-x-6">
              <CommonButton
                type="button"
                label="Cancel"
                className="text-customRed border-customRed border"
                onClick={confirmationHandleClose}
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={firstSubmitFunc}
              >
                {firstButtonMsg}
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={secondSubmitFunc}
              >
                {secondButtonMsg}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
