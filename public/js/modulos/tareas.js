const tareas = document.querySelector('.listado-pendientes');
import axios from 'axios';
import Swal from 'sweetalert2';
import { actualizarAvance } from '../funciones/avance';

if(tareas){

    tareas.addEventListener('click', e =>{
        if(e.target.classList.contains('fa-check-circle')){
            const  icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            
            // request hacia /tareas/:id location.origin
            const url = `${location.origin}/tareas/${idTarea}`;
            //console.log(url);

            axios.patch(url, {idTarea})
                .then(function (respuesta) {
                    //console.log(respuesta);
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                });
        }

        if(e.target.classList.contains('fa-trash')){
           

            const tareaHTML = e.target.parentElement.parentElement,
                  idTarea = tareaHTML.dataset.tarea;
                  
            /* console.log(tareaHTML);
            console.log(idTarea); */

            Swal.fire({
                title: 'Deseas borrar esta Tarea?',
                text: "Una tarea eliminada no se puede recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar',
                cancelButtonText: 'No, cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    //enviar el delete por medio axios
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, {params: { idTarea}})
                        .then(function (respuesta) {
                            //console.log(respuesta);
                            if(respuesta.status === 200){
                                console.log(respuesta);
                                //Eliminar el Nodo
                                tareaHTML.parentElement.removeChild(tareaHTML);


                                //Opcional Alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                );
                                setTimeout(() => {
                                    window.location.href = '/'
                                }, 3000); 

                                actualizarAvance();
                            }
                        })

                }
            })
        }
    });
}

export default tareas;