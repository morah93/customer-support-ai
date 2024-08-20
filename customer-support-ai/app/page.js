"use client";
import pgbkgrnd from "./src/pgbkgrnd.jpg";
import chatbackground from "./src/chatbackground.jpg";
import Image from "next/image";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
	const [messages, setMessages] = useState([
		{
			role: "assistant",
			content:
				"Hi! I'm Muftis Assistant. How can I help you today?",
		},
	]);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const sendMessage = async () => {
		if (!message.trim() || isLoading) return; // Don't send empty messages
		setIsLoading(true);

		setMessage("");
		setMessages((messages) => [
			...messages,
			{ role: "user", content: message },
			{ role: "assistant", content: "" },
		]);

		try {
			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify([...messages, { role: "user", content: message }]),
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const text = decoder.decode(value, { stream: true });
				setMessages((messages) => {
					let lastMessage = messages[messages.length - 1];
					let otherMessages = messages.slice(0, messages.length - 1);
					return [
						...otherMessages,
						{ ...lastMessage, content: lastMessage.content + text },
					];
				});
			}
		} catch (error) {
			console.error("Error:", error);
			setMessages((messages) => [
				...messages,
				{
					role: "assistant",
					content:
						"I'm sorry, but I encountered an error. Please try again later.",
				},
			]);
		}
		setIsLoading(false);
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			sendMessage();
		}
	};

	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div
			style={{
				backgroundImage: `url(https://images.pexels.com/photos/1033079/pexels-photo-1033079.jpeg)`,
				backgroundSize: "cover", // Make the image cover the entire container
				backgroundPosition: "center", // Center the image
				backgroundRepeat: "no-repeat", // Prevent the image from repeating
				display: "flex", // Use flexbox for layout
				justifyContent: "center", // Distribute space between children
				height: "100vh", // Set height to full viewport height
        width: "100%",
        paddingRight:'100px',
				paddingLeft: '0px'
			}}
    >
      <h2>AI Chatbox</h2>
			<div
				style={{
					width: "100vh",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					// backgroundColor: 'white',
          // opacity:'50%'
          paddingLeft: '100px'
				}}
			>
				{/* <img
					src='https://www.radware.com/RadwareSite/MediaLibraries/Images/Cyberpedia/Bot%20Manager/types-of-bots.jpg'
					alt='image'
					height={"100px"}
					width='100px'
				/> */}
				<p style={{ color: "white", backgroundColor: 'gray' }}>Name: Muftis Assistant</p>
				{/* <p style={{ color: "white", backgroundColor: 'gray' }}>Status: Online</p> */}
			</div>
			{/* <image src={pgbkgrnd } alt='image' /> */}
			<div
				// marginTop='500px'
				id='box'
				style={{
					width: "100vh",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Stack
					style={{
						direction: "column",
						width: "500px",
						height: "700px",
						border: "1px solid black",
						borderRadius: "10px",
						p: 2,
						spacing: 3,
						backgroundColor: "lightgray",
						opacity: "50%",
						padding: "10px",
						// backgroundImage:"url('https://images.pexels.com/photos/3517899/pexels-photo-3517899.jpeg')"
					}}
				>
					<Stack
						direction={"column"}
						spacing={2}
						flexGrow={1}
						overflow='auto'
						maxHeight='100%'
						opacity='0%'
					>
						{messages.map((message, index) => (
							<Box
								key={index}
								display='flex'
								justifyContent={
									message.role === "assistant" ? "flex-start" : "flex-end"
								}
							>
								<Box
									bgcolor={
										message.role === "assistant"
											? "primary.main"
											: "secondary.main"
									}
									color='white'
									borderRadius={16}
									p={3}
								>
									{message.content}
								</Box>
							</Box>
						))}
						<div ref={messagesEndRef} />
					</Stack>
					<Stack
						direction={"row"}
						spacing={2}
					>
						<TextField
							label='Message'
							fullWidth
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							disabled={isLoading}
							// color="white"
						/>
						<Button
							variant='contained'
							onClick={sendMessage}
						>
							{isLoading ? "Sending..." : "Send"}
						</Button>
					</Stack>
				</Stack>
			</div>
		</div>
	);
}
