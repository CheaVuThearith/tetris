rotateBlock90Degrees = (block) => {
      // Convert the block indices to row and column indices
      block = block.map((i) => [Math.floor(i / 10), i % 10]);

      // Move the block to the origin
      let minRow = Math.min(...block.map(([i, j]) => i));
      let minCol = Math.min(...block.map(([i, j]) => j));
      block = block.map(([i, j]) => [i - minRow, j - minCol]);

      // Rotate the block
      block = block.map(([i, j]) => [j, i]);

      // Reverse the row indices
      let maxRow = Math.max(...block.map(([i, j]) => i));
      block = block.map(([i, j]) => [maxRow - i, j]);

      // Move the block back to its original position
      block = block.map(([i, j]) => [i + minRow, j + minCol]);

      // Convert the row and column indices back to block indices
      block = block.map(([i, j]) => i * 10 + j);
      return block
    };
    console.log(rotateBlock90Degrees([13,14,15]))