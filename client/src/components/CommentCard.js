import { ListItem, Typography } from '@mui/material';

function CommentCard(props) {
    const { comment } = props;
    return (
        <ListItem style={{ position:'relative' ,margin:'10px', padding:'10px', borderRadius:'15px', backgroundColor: '#d4af37', 
                        width:'auto', height:'auto', display:'flex', flexDirection:'column', alignContent:'left', borderStyle: 'solid', borderColor: '#111111', borderWidth: '2px'}}>
            <Typography style={{ width:'95%',     color: '#1310ec', textDecoration: 'underline', fontWeight: 'bold', fontSize: '12', flex:'none', alignSelf:'left', overflowWrap:'break-word', marginBottom: '3px'}}> {comment.userName}</Typography>
            <Typography style={{color: '#111111', width:'95%',  fontSize: '24', textOverflow:'auto', flex:'none', overflowWrap:'break-word'}}> {comment.content} </Typography>
        </ListItem>
    );
}

export default CommentCard;