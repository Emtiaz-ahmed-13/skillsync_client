"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface PlaceBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceBid: (bid: {
    amount: number;
    coverLetter: string;
    deliveryTime: number;
  }) => void;
  projectTitle: string;
  minBudget: number;
  maxBudget: number;
}

export function PlaceBidModal({
  isOpen,
  onClose,
  onPlaceBid,
  projectTitle,
  minBudget,
  maxBudget,
}: PlaceBidModalProps) {
  const [amount, setAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!amount) {
      newErrors.amount = "Bid amount is required";
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = "Bid amount must be a positive number";
      } else if (amountNum < minBudget || amountNum > maxBudget) {
        newErrors.amount = `Bid amount must be between $${minBudget} and $${maxBudget}`;
      }
    }

    if (!coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (coverLetter.length < 50) {
      newErrors.coverLetter = "Cover letter must be at least 50 characters";
    }

    if (!deliveryTime) {
      newErrors.deliveryTime = "Delivery time is required";
    } else {
      const deliveryTimeNum = parseInt(deliveryTime);
      if (isNaN(deliveryTimeNum) || deliveryTimeNum <= 0) {
        newErrors.deliveryTime = "Delivery time must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onPlaceBid({
        amount: parseFloat(amount),
        coverLetter,
        deliveryTime: parseInt(deliveryTime),
      });

      // Reset form
      setAmount("");
      setCoverLetter("");
      setDeliveryTime("");
      setErrors({});
      onClose();
    }
  };

  const handleClose = () => {
    // Reset form
    setAmount("");
    setCoverLetter("");
    setDeliveryTime("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Place a Bid</DialogTitle>
          <DialogDescription className="text-gray-600">
            Submit your bid for "{projectTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right text-gray-900">
                Bid Amount
              </Label>
              <div className="col-span-3 relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 border-gray-200 text-gray-900"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.amount && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {errors.amount}
                </p>
              )}
              <p className="col-span-3 col-start-2 text-sm text-gray-500">
                Budget: ${minBudget} - ${maxBudget}
              </p>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="deliveryTime"
                className="text-right text-gray-900"
              >
                Delivery Time
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="deliveryTime"
                  type="number"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="border-gray-200 text-gray-900"
                  placeholder="Number of days"
                  min="1"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  days
                </span>
              </div>
              {errors.deliveryTime && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {errors.deliveryTime}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="coverLetter"
                className="text-right text-gray-900 pt-2"
              >
                Cover Letter
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="border-gray-200 text-gray-900"
                  placeholder="Explain why you're the best fit for this project..."
                  rows={4}
                />
                {errors.coverLetter && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.coverLetter}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 50 characters
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-skillsync-cyan text-skillsync-dark-blue hover:bg-skillsync-cyan/90"
            >
              Place Bid
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
