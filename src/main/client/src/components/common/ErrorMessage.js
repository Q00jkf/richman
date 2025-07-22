/**
 * Error Message Component
 * 
 * 用於顯示錯誤訊息的通用組件
 */

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ErrorContainer = styled(motion.div)`
  background: ${props => props.theme.error.background || '#ffebee'};
  border: 1px solid ${props => props.theme.error.main || '#f44336'};
  border-radius: 8px;
  padding: 16px;
  margin: 12px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const ErrorIcon = styled.div`
  color: ${props => props.theme.error.main || '#f44336'};
  font-size: 1.2rem;
  margin-top: 2px;
`;

const ErrorContent = styled.div`
  flex: 1;
  
  .error-title {
    font-weight: 600;
    color: ${props => props.theme.error.main || '#f44336'};
    margin: 0 0 4px 0;
    font-size: 1rem;
  }
  
  .error-message {
    color: ${props => props.theme.text.primary || '#333'};
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.error.main || '#f44336'};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(244, 67, 54, 0.1);
  }
`;

function ErrorMessage({ 
  message, 
  title = "Error", 
  onClose, 
  theme,
  ...props 
}) {
  return (
    <ErrorContainer
      theme={theme}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      {...props}
    >
      <ErrorIcon theme={theme}>⚠️</ErrorIcon>
      <ErrorContent theme={theme}>
        <div className="error-title">{title}</div>
        <div className="error-message">{message}</div>
      </ErrorContent>
      {onClose && (
        <CloseButton theme={theme} onClick={onClose}>
          ✕
        </CloseButton>
      )}
    </ErrorContainer>
  );
}

export default ErrorMessage;