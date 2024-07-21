import React, { useState } from 'react';
import { Button, Grid, Container, Box, styled } from '@mui/material';

// 圆形按钮样式
const RoundButton = styled(Button)(() => ({
  borderRadius: '50%',
  minWidth: '60px',
  minHeight: '60px',
  fontSize: '1.2rem',
}));

// 数字键盘组件
const NumberPad = ({ onInput }: { onInput: (num: number | 'backspace') => void }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const handleClick = (num: number) => {
    onInput(num);
  };

  const handleBackspace = () => {
    onInput('backspace');
  };

  return (
    <Grid container spacing={2} justifyContent="center" mt={20}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3} mt={3}>
            {numbers.map((num) => (
                <Grid item key={num}>
                    <RoundButton variant="outlined" onClick={() => handleClick(num)}>
                        {num}
                    </RoundButton>
                </Grid>
            ))}
            <Grid item mt={3}>
                <Button sx={{m: 0, p: 1}} variant="outlined" onClick={handleBackspace}>
                ←
                </Button>
            </Grid>
        </Box>
    </Grid>
  );
};

// 输入指示器组件
const InputIndicator = ({ length }: { length: number }) => {
  return (
    <Box display="flex" justifyContent="center" mt={20}>
      {[...Array(6)].map((_, index) => (
        <Box
          key={index}
          width={10}
          height={10}
          borderRadius="50%"
          bgcolor={index < length ? 'primary.main' : 'grey.300'}
          mx={1}
        />
      ))}
    </Box>
  );
};

// 钱包解锁组件
const WalletUnlock = () => {
  const [inputLength, setInputLength] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const handleInput = (num: number | 'backspace') => {
    if (num === 'backspace') {
      setInputValue(inputValue.slice(0, -1));
      setInputLength(Math.max(0, inputLength - 1));
    } else {
      if (inputLength < 6) {
        setInputValue(inputValue + num);
        setInputLength(inputLength + 1);
      }
    }
  };

  return (
    <Container>
      <InputIndicator length={inputLength} />
      <NumberPad onInput={handleInput} />
    </Container>
  );
};

export default WalletUnlock;