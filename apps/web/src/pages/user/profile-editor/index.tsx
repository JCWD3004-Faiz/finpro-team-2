import React, { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import axios, { AxiosError } from "axios";
import { UserSidebar } from "@/components/UserSideBar";
import { EmailVerificationCard } from "@/components/email-verification-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import SuccessModal from "@/components/modal-success";
import ErrorModal from "@/components/modal-error";
import { hideSuccess, showSuccess } from "@/redux/slices/successSlice";
import { hideError, showError } from "@/redux/slices/errorSlice";
import ConfirmationModal from "@/components/modal-confirm";
import {
  showConfirmation,
  hideConfirmation,
} from "@/redux/slices/confirmSlice";
import {
  setUpdateUsername,
  setUpdateEmail,
  setUpdateImage,
} from "@/redux/slices/updateProfileSlice";
import Cookies from "js-cookie";
import LoadingVignette from "@/components/LoadingVignette";

const access_token = Cookies.get("access_token");

const ProfileEditor: React.FC = () => {
  const user = useAuth();
  const user_id = user?.id;
  const dispatch = useDispatch<AppDispatch>();
  const { username, is_verified, email, image, loading } = useSelector(
    (state: RootState) => state.userProfile
  );
  const { updateUsername, updateEmail, updateImage } = useSelector(
    (state: RootState) => state.updateProfile
  );
  const { isSuccessOpen, successMessage } = useSelector(
    (state: RootState) => state.success
  );
  const { isErrorOpen, errorMessage } = useSelector(
    (state: RootState) => state.error
  );
  const { isConfirmationOpen, confirmationMessage, onConfirm } = useSelector(
    (state: RootState) => state.confirm
  );
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validImageTypes.includes(file.type)) {
      dispatch(
        showError(
          "Invalid file type. Only JPEG, PNG, GIV and WebP are allowed."
        )
      );
      return;
    }

    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      dispatch(
        showError("File size exceeds 1MB. Please upload a smaller image.")
      );
      return;
    }

    dispatch(setUpdateImage(file));

    const formData = new FormData();
    formData.append("image", file);

    setIsLoading(true);
    try {
      const response = await axios.post(`/api/profile/upload-pic`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`, // Replace `access_token` with your actual access token variable
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedImageUrl = response.data.imageUrl;

      dispatch(setUpdateImage(updatedImageUrl));
      dispatch(showSuccess("Profile picture updated successfully!"));
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const errorMessage =
          typeof error.response.data?.detail === "string"
            ? error.response.data.detail
            : "An error occurred.";
        dispatch(showError(errorMessage));
      } else {
        dispatch(
          showError("Failed to update profile picture. Please try again.")
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (updateUsername.trim()) {
      if (updateUsername.length > 50) {
        dispatch(showError("Username cannot be more than 50 characters!"));
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.patch(
          `/api/profile/username/${user_id}`,
          {
            username: updateUsername,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        dispatch(setUpdateUsername(updateUsername));
        dispatch(showSuccess("Username updated successfully!"));
        setIsEditingUsername(false);
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          const errorMessage =
            typeof error.response.data?.detail === "string"
              ? error.response.data.detail
              : "An error occurred.";
          dispatch(showError(errorMessage));
        } else {
          dispatch(showError("Failed to update username. Please try again."));
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      dispatch(showError("Username cannot be empty!"));
    }
  };

  const handleEmailUpdate = async () => {
    if (updateEmail.trim()) {
      dispatch(
        showConfirmation({
          message: "Are you sure you want to update your email?",
          onConfirm: async () => {
            setIsLoading(true);
            try {
              const response = await axios.patch(
                `/api/profile/email/${user_id}`,
                {
                  email: updateEmail,
                },
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              );
              dispatch(setUpdateEmail(updateEmail));
              dispatch(showSuccess("Email updated successfully!"));
              setIsEditingEmail(false);
            } catch (error) {
              if (error instanceof AxiosError && error.response) {
                const errorMessage =
                  typeof error.response.data?.detail === "string"
                    ? error.response.data.detail
                    : "An error occurred.";
                dispatch(showError(errorMessage));
              } else {
                dispatch(
                  showError("Failed to update email. Please try again.")
                );
              }
            } finally {
              setIsLoading(false);
            }
          },
        })
      );
    } else {
      dispatch(showError("Email cannot be empty!"));
    }
  };

  useEffect(() => {
    if (username) {
      dispatch(setUpdateUsername(username));
    }
    if (email) {
      dispatch(setUpdateEmail(email));
    }
  }, [dispatch, username, email]);

  return (
    <div className="min-h-screen w-screen bg-white mt-[11vh] p-8">
      {isLoading && <LoadingVignette />}
      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          dispatch(hideSuccess());
          window.location.href = "/";
        }}
        successMessage={successMessage}
      />
      <ErrorModal
        isOpen={isErrorOpen}
        onClose={() => {
          dispatch(hideError());
        }}
        errorMessage={errorMessage}
      />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        message={confirmationMessage || "Are you sure you want to proceed?"}
        onConfirm={() => {
          if (onConfirm) {
            onConfirm();
          }
          dispatch(hideConfirmation());
        }}
        onClose={() => dispatch(hideConfirmation())} // Close the modal if canceled
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <UserSidebar />

          {/* main profile update */}
          <div className="min-h-screen bg-white rounded-lg">
            <div className="max-w-4xl space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl text-gray-800 font-semibold">
                  My Profile
                </h1>
                <p className="text-muted-foreground">
                  Manage your Profile here
                </p>
              </div>

              {/* update profile picture */}
              <Card
                style={{
                  boxShadow:
                    "0 -1px 6px rgba(0, 0, 0, 0.1), 0 4px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Camera className="w-5 h-5" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                      <AvatarImage
                        src={
                          updateImage
                            ? URL.createObjectURL(updateImage) // Use the selected image
                            : image || undefined // Fallback to the original image
                        }
                        alt="Profile picture"
                        className="w-full h-full object-cover"
                      />
                      <AvatarFallback>
                        <User className="w-8 h-8 sm:w-12 sm:h-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col sm:flex-row w-full items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full max-w-xs text-sm sm:text-base"
                        id="picture-upload"
                      />
                      <Button
                        onClick={() =>
                          document.getElementById("picture-upload")?.click()
                        }
                        className="w-full sm:w-auto"
                      >
                        Update Picture
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* update username */}
              <Card
                style={{
                  boxShadow:
                    "0 -1px 6px rgba(0, 0, 0, 0.1), 0 4px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <User className="w-5 h-5" />
                    Username
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="username">Current Username</Label>
                      {isEditingUsername ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            type="text"
                            id="username"
                            value={updateUsername}
                            onChange={(e) =>
                              dispatch(setUpdateUsername(e.target.value))
                            }
                            className="w-full sm:max-w-md"
                          />
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <Button
                              onClick={handleUsernameUpdate}
                              className="flex-1 sm:flex-none"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditingUsername(false)}
                              className="flex-1 sm:flex-none"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <span className="text-lg">{username}</span>
                          <Button
                            onClick={() => setIsEditingUsername(true)}
                            className="w-full sm:w-auto"
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* update email address */}
              <Card
                style={{
                  boxShadow:
                    "0 -1px 6px rgba(0, 0, 0, 0.1), 0 4px 3px rgba(0, 0, 0, 0.08)",
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Mail className="w-5 h-5" />
                    Email Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="email">Current Email</Label>
                      {isEditingEmail ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            type="email"
                            id="email"
                            value={updateEmail ?? ""}
                            onChange={(e) =>
                              dispatch(setUpdateEmail(e.target.value))
                            }
                            className="w-full sm:max-w-md"
                          />
                          <div className="flex gap-2 mt-2 sm:mt-0">
                            <Button
                              onClick={handleEmailUpdate}
                              className="flex-1 sm:flex-none"
                            >
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditingEmail(false)}
                              className="flex-1 sm:flex-none"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                          <span className="text-lg break-all sm:break-normal">
                            {email}
                          </span>
                          <Button
                            onClick={() => setIsEditingEmail(true)}
                            className="w-full sm:w-auto"
                          >
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* email verify card */}
              {!is_verified && (
                <div
                  className="flex items-center justify-center bg-gradient-to-b from-background to-muted"
                  style={{
                    boxShadow:
                      "0 -1px 6px rgba(0, 0, 0, 0.1), 0 4px 3px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <EmailVerificationCard email={email || ""} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
