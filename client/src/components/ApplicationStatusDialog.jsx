import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { CheckCircle, XCircle, MessageSquare, Calendar } from 'lucide-react';

const ApplicationStatusDialog = ({
    isOpen,
    onClose,
    onConfirm,
    status,
    candidateName,
    jobTitle,
    loading = false
}) => {
    const [details, setDetails] = useState('');

    const handleSubmit = () => {
        const detailsObj = status === 'accepted'
            ? { interviewDetails: details }
            : { feedback: details };

        onConfirm(detailsObj);
        setDetails('');
    };

    const handleClose = () => {
        setDetails('');
        onClose();
    };

    const isAccepted = status === 'accepted';
    const isRejected = status === 'rejected';

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {isAccepted && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {isRejected && <XCircle className="h-5 w-5 text-red-600" />}
                        {isAccepted ? 'Accept' : 'Reject'} Application
                    </DialogTitle>
                    <DialogDescription>
                        You are about to {status} the application from <strong>{candidateName}</strong> for <strong>{jobTitle}</strong>.
                        {status !== 'pending' && ' The candidate will be notified via email in 30 seconds.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {isAccepted && (
                        <div className="space-y-2">
                            <Label htmlFor="interview-details" className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Interview Details (Optional)
                            </Label>
                            <Textarea
                                id="interview-details"
                                placeholder="Interview date, time, location, contact person, etc.&#10;&#10;Example:&#10;Interview scheduled for Monday, Nov 4th at 2:00 PM&#10;Location: Office Building, Conference Room A&#10;Contact: John Doe (john@company.com)&#10;Please bring: Portfolio and ID"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-sm text-muted-foreground">
                                Provide interview scheduling information or next steps for the candidate.
                            </p>
                        </div>
                    )}

                    {isRejected && (
                        <div className="space-y-2">
                            <Label htmlFor="rejection-feedback" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Feedback (Optional)
                            </Label>
                            <Textarea
                                id="rejection-feedback"
                                placeholder="Constructive feedback for the candidate...&#10;&#10;Example:&#10;Thank you for your interest. While your skills are impressive, we've decided to move forward with candidates who have more experience with our specific tech stack. We encourage you to apply for future opportunities that match your expertise."
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-sm text-muted-foreground">
                                Provide constructive feedback to help the candidate improve.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            variant={isAccepted ? "default" : "destructive"}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </div>
                            ) : (
                                `${isAccepted ? 'Accept' : 'Reject'} Application`
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ApplicationStatusDialog;