import axios from "axios";
import config from "../config";

export const sendMessagesToSlack = async (message: string) : Promise<void> => {
    try {
        await axios.post(config.webhookURL, { text: message });
    } catch (error) {
        console.log(error);
        throw error;
    }
}