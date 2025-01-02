import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GiftVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGiftVoucher: (email: string) => void;
}

const GiftVoucherModal: React.FC<GiftVoucherModalProps> = ({ isOpen, onClose, onGiftVoucher }) => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    if (email) {
      onGiftVoucher(email);
      setEmail("");
      onClose();
    } else {
      alert("Please enter a valid email.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-white text-gray-800 p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle>Gift Voucher</DialogTitle>
        </DialogHeader>
        {/* Use DialogContent for the input form */}
        <Input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter recipient's email"
          className="w-full p-2 mb-4"
        />
        <DialogFooter>
          <Button onClick={handleSubmit} className=" text-white mr-2">
            Gift Voucher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GiftVoucherModal;
