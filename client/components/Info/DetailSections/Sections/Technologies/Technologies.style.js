import styled from 'react-emotion';

export { SectionContentDIV } from '../Sections.style';

export const SkillType = styled.div `
  align-items: baseline;
  border-bottom: 1px dashed #ddd;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 120px auto;
  grid-template-rows: 1fr;

  &:last-child {
    border: 0;
  }
`;

export const SkillName = styled.h4 `
  margin: 0;
`;

export const SkillList = styled.ul `
  margin: 0;
  margin-bottom: 10px;
  padding: 0;
`;

export const Skill = styled.li `
  display: inline-block;

  &::after {
    content: '•';
    padding: 0 0.5em;
  }
  &:last-child {
    &::after {
      content: '';
      padding: 0;
    }
  }
`;