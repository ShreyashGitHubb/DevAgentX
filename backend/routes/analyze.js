import express from 'express';
import { routeRequest } from '../agents/router.js';
import { handleNanoRequest } from '../agents/nano.js';
import { handleSuperRequest } from '../agents/super.js';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { input = '', task = 'explain' } = req.body;

    if (!input || input.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Input content is required.'
      });
    }

    // Step 1: Run through Router Agent
    const routingDecision = routeRequest(input, task);
    const { agent, reason } = routingDecision;

    let responseData;

    // Step 2: Execute based on routing decision
    if (agent === 'nano') {
      const nanoResult = handleNanoRequest(input, task);
      responseData = {
        success: true,
        agent: 'nano',
        reason,
        output: nanoResult.output,
        metadata: nanoResult.metadata
      };
    } else {
      // Super agent (requires async processing)
      const superResult = await handleSuperRequest(input, task);
      responseData = {
        success: true,
        agent: 'super',
        reason,
        thinking: superResult.thinking,
        output: superResult.output,
        metadata: superResult.metadata
      };
    }

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Analysis routing error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred during task routing and execution.',
      message: error.message
    });
  }
});

export default router;
