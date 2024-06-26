import React, { useState, useRef } from "react";
import { Container, Text, VStack, IconButton, useToast, HStack } from "@chakra-ui/react";
import VideoPreview from "../components/VideoPreview.jsx";
import { FaVideo, FaStop } from "react-icons/fa";
import { handleFileUpload } from "../utils/genai.js";
import { useNavigate } from "react-router-dom";

const VideoRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);
  const toast = useToast();

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setIsRecording(true);
      toast({
        title: "Video recording started.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error starting video recording.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const stopVideoRecording = async () => {
    try {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsRecording(false);
      toast({
        title: "Video recording stopped and uploaded.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      const response = await handleFileUpload(videoRef.current.srcObject, "video");
      toast({
        title: "Upload response",
        description: response,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error stopping video recording.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Video Recording</Text>
        <HStack spacing={4}>
          <IconButton aria-label="Record Video" icon={<FaVideo />} size="lg" onClick={startVideoRecording} isDisabled={isRecording} />
          <IconButton aria-label="Stop Recording" icon={<FaStop />} size="lg" onClick={stopVideoRecording} isDisabled={!isRecording} />
        </HStack>
        <VideoPreview videoRef={videoRef} />
      </VStack>
    </Container>
  );
};

export default VideoRecording;
