window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;
window.IDBTransaction=window.IDBTransaction||window.webkitIDBTransaction||window.msIDBTransaction;
window.IDBKeyRange=window.IDBKeyRange||window.webkitIDBKeyRange||window.msIDBKeyRange;
if(window.indexedDB==false){
    alert('Maaf, browser kamu tidak support IndexedDB');
}else{
    console.log("Oke, browser support IndexedDB :)");
    var db;
    var request=window.indexedDB.open('database',1);
    request.onerror=function(event){
        console.log('database error');
    };
    request.onupgradeneeded=function(event){
        db=event.target.result;
        db.createObjectStore('tabel', {keyPath: 'id'});
    };
    request.onsuccess=function(event){
        db=request.result;
        var tabel=db.transaction(['tabel']).objectStore('tabel').get('array_data');
        tabel.onerror=function(event){
            console.log('tabel error');
        };
        tabel.onsuccess=function(event){
            if(event.target.result==undefined){
                array_data=new Array();
            }else{
                array_data=JSON.parse(event.target.result.value);
            }
        };
        inisialisasi();
    };
    var array_data;
    var jumlah_data;
    function inisialisasi(){
        var tabel=db.transaction(['tabel']).objectStore('tabel').get('array_data');
        tabel.onerror=function(event){
            console.log('tabel error');
        };
        tabel.onsuccess=function(event){
            if(event.target.result==undefined){
                array_data=new Array();
            }else{
                array_data=JSON.parse(event.target.result.value);
            }
            jumlah_data=array_data.length;
            if(jumlah_data==0){
                var kosong=document.createElement('TR');
                var isi=document.createElement('TD');
                isi.innerHTML='Data masih kosong';
                kosong.appendChild(isi);
                kosong.setAttribute('id','kosong');
                document.getElementById("registered").appendChild(kosong);
            }else{
                tampil_data();
            }
        };
    }
    function tampil_data(){
        for(var i=0;i<=jumlah_data;i++){
            var tabel=db.transaction(['tabel']).objectStore('tabel').get('c'+array_data[i]);
            tabel.onsuccess=function(event){
                if(event.target.result!=undefined){
                    var chat_new=JSON.parse(event.target.result.value);
                    showdata(chat_new[0],chat_new[1],chat_new[2],chat_new[3]);
                }
            };
        }
    }
    function showdata(id,email,nama,alamat){
        var a=document.createElement('TR');
        a.setAttribute('id','data'+id);
        var b=document.createElement('TD');
        b.innerHTML=id;
        var c=document.createElement('TD');
        c.innerHTML=email;
        var d=document.createElement('TD');
        d.innerHTML=nama;
        var e=document.createElement('TD');
        e.innerHTML=alamat;
        a.appendChild(b);
        a.appendChild(c);
        a.appendChild(d);
        a.appendChild(e);
        document.getElementById("registered").appendChild(a);
    }
    document.getElementById('daftar').onclick=function(){
        var tabel=db.transaction(['tabel']).objectStore('tabel').get('array_data');
        tabel.onsuccess=function(event){
            if(event.target.result==undefined){
                array_data=new Array();
            }else{
                array_data=JSON.parse(event.target.result.value);
            }
            var id_terbaru=parseInt(array_data[0]);
            datanew=new Array();
            jumlah_data=(id_terbaru>0) ? id_terbaru+1 : 1;
            datanew[0]=jumlah_data;
            datanew[1]=document.getElementById('email').value;
            datanew[2]=document.getElementById('nama').value;
            datanew[3]=document.getElementById('alamat').value;
            db.transaction(['tabel'], 'readwrite').objectStore('tabel').add({ id: 'c'+jumlah_data, value: JSON.stringify(datanew) });
            array_data.unshift(jumlah_data);
            db.transaction(['tabel'], 'readwrite').objectStore('tabel').delete('array_data');
            db.transaction(['tabel'], 'readwrite').objectStore('tabel').add({ id: 'array_data', value: JSON.stringify(array_data) });
            alert("Berhasil, silahkan refresh halaman untuk melihat perubahan");
        };
    };
}