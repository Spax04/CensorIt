import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
export async function scanLink(req: Request, res: Response): Promise<any> {
  // TODO: Implement a proper link scanner.

  const { userId, link } = req.body;

  //! TEST
  console.log(req.body);

  return res.send({ message: 'Scanning Link' });
}



// Your scanText function
const userChunksMap: Map<string, string[]> = new Map();

export async function scanText(req: Request, res: Response): Promise<void> {
  try {
    // Retrieve data from request body
    const { webPageChunk, userId, totalChunks, currentChunkIndex } = req.body;

    // Initialize an array to store chunks for the user if it doesn't exist
    if (!userChunksMap.has(userId)) {
      userChunksMap.set(userId, []);
    }

    // Store the received chunk
    userChunksMap.get(userId)![currentChunkIndex] = webPageChunk;

    // Check if all chunks have been received
    if (userChunksMap.get(userId)!.length === totalChunks) {
      // Reconstruct the complete HTML page
      const completeWebPage = userChunksMap.get(userId)!.join('');

      // Clear the stored chunks
      userChunksMap.delete(userId);

      // Do something with the complete HTML content (e.g., modify the webpage)
      const modifiedWebPage = modifyWebPage(completeWebPage);

      // Return the modified HTML page to the client
      res.send({ modifiedWebPage });
    } else {
      // Respond with success message indicating chunk received
      res.send({ message: `Chunk ${currentChunkIndex + 1} of ${totalChunks} received.` });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).send({ error: 'Internal server error' });
  }
}

function modifyWebPage(webPage: string): string {
  // Find the <title> tag and replace its content with "MODIFIED"
  const modifiedTitle = webPage.replace(/<title[^>]*>.*?<\/title>/i, '<title>MODIFIED</title>');
  
  // Return the modified HTML content
  return modifiedTitle;
}