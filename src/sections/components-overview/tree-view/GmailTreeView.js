
import MainCard from 'components/MainCard';

// ==============================|| TREE VIEW - GMAIL ||============================== //

export default function GmailTreeView() {
  const gmailTreeviewCodeString = `// GmailTreeView.tsx
<TreeView
  aria-label="gmail"
  defaultExpanded={['3']}
  defaultCollapseIcon={<ArrowDown3 variant="Bold" />}
  defaultExpandIcon={<ArrowRight3 variant="Bold" />}
  defaultEndIcon={<div style={{ width: 24 }} />}
  sx={{ height: 400, flexGrow: 1, overflowY: 'auto' }}
>
  
</TreeView>`;

  return (
    <MainCard title="Gmail Clone" codeString={gmailTreeviewCodeString}>
    </MainCard>
  );
}
