let map=L.map('map').setView([20.5937,78.9629],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
map.on('click',e=>{localStorage.setItem('lastLat',e.latlng.lat);localStorage.setItem('lastLng',e.latlng.lng);});

function loadEntries(){
  let list=JSON.parse(localStorage.getItem('entries')||"[]");
  let ul=document.getElementById('entries'); ul.innerHTML='';
  list.forEach((e,i)=>{
    let li=document.createElement('li');
    li.innerHTML=`<b>${e.title}</b><br>${e.notes}<br>${e.lat},${e.lng}<br>`+(e.photo?`<img src="${e.photo}" width="150"/>`:'');
    ul.appendChild(li);
  });
}
loadEntries();

document.getElementById('photo').addEventListener('change',function(){
  let f=this.files[0];
  let r=new FileReader();
  r.onload=function(){localStorage.setItem('lastPhoto',r.result);}
  r.readAsDataURL(f);
});

function saveEntry(){
  let title=document.getElementById('title').value;
  let notes=document.getElementById('notes').value;
  let lat=localStorage.getItem('lastLat')||'';
  let lng=localStorage.getItem('lastLng')||'';
  let photo=localStorage.getItem('lastPhoto')||'';
  let list=JSON.parse(localStorage.getItem('entries')||"[]");
  list.push({title,notes,lat,lng,photo});
  localStorage.setItem('entries',JSON.stringify(list));
  loadEntries();
  alert('Saved!');
}

function exportPDF(){
  const {jsPDF}=window.jspdf;
  let pdf=new jsPDF();
  let list=JSON.parse(localStorage.getItem('entries')||"[]");
  let y=10;
  list.forEach(e=>{
    pdf.text(`Title: ${e.title}`,10,y); y+=10;
    pdf.text(`Notes: ${e.notes}`,10,y); y+=10;
    pdf.text(`Location: ${e.lat},${e.lng}`,10,y); y+=10;
    y+=10;
  });
  pdf.save("travel_journal.pdf");
}
