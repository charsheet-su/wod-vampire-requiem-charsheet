<?
$groups=array('Architect','Competitor','Gallant','Mediator','Survivor','Autocrat','Confidant','Honest-Abe','Optimist','Sycophant','Autist','Conformist','Jester','Pedagogue','Traditionalist','Avant-Garde','Conniver','Jobsworth','Penitent','Thrill-Seeker','Bon Vivant','Critic','Judge','Perfectionist','Visionary','Bravo','Curmudgeon','Loner','Plotter','Caregiver','Deviant','Manipulator','Poltroon','Cavalier','Director','Martyr','Praise-Seeker','Child','Fanatic','Masochist','Rebel');
$j=array();
$i=0;
foreach($groups as $v)
{
  $j[]=array('value'=>$i,'text'=>$v);
  $i++;
}
echo json_encode($j);
?>