<style>



  .mainban {
        position: relative;
        background-image: url("{{ asset('images/banner.jpg') }}");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        min-height: 100vh;
        display: flex;
      
        justify-content: center;
        padding: 50px 20px;
        color: white;
         
    }

  text-align: left;
    }
    h3 {
        font-size: 1.8rem;
        font-weight: bold;
    }

    h5 {
        font-size: 1.2rem;
        
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .mainban {
            text-align: center;
            flex-direction: column;
            padding: 30px 15px;
        }

        .col-md-7, .col-md-5 {
            width: 100%; /* Stack columns on smaller screens */
        }
    }
    
 .custom-card {
     min-height:160px;
            display: flex;
            flex-direction: row;
            width: 100%;
            border-radius: 15px; /* Rounded corners */
            overflow: hidden; /* Ensure rounded corners apply */
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
            margin: 15px;
            background: #B8B8B8;
        }
    .card{
         transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); /* Soft shadow */
        
    }

        .custom-card:hover, .card:hover {
            transform: scale(1.04); /* Scale effect on hover */
            box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2); /* Stronger shadow */
        }

        .card-img-left {
            width: 35%; /* Adjust image width */
            object-fit: cover; /* Ensures image fills space */
           
        }

        .card-body {
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .card-title {
            font-size: 1.8rem;
            font-weight: bold;
        }

        .card-text {
            font-size: 1.2rem;
            color: #555;
        }

        @media (max-width: 768px) {
            .custom-card {
                flex-direction: column; /* Stack image & text vertically */
            }

            .card-img-left {
                width: 100%;
                height: 200px;
            }
        }
</style>

<div class="row mainban">
    <div style="background: rgba(0, 0, 0, 0.6); opacity:0.1">
        </div>
        
  
    <div class="col-md-6 col-lg-6 col-12 ">
        <h1 style="font-size: 32px;
    line-height: 1.2;
    font-weight: 500;">
            Ready to level-up your cybersecurity and privacy expertise? Our personalized training program is crafted to align your expertise with your career ambitions. Earn industry-recognized certifications that validate your proficiency in the field.
        </h1><br><br>
        <p style="color: #d88840;font-size: 21px;
    line-height: 1.2;
    font-weight: 500;
    font-style: italic;
    filter: drop-shadow(2px 4px 6px black);
    margin: 0;">
            Dive into a comprehensive curriculum encompassing crucial domains to navigate and thrive in dynamic cybersecurity and threat landscape. Choose from flexible learning formats, including online courses, in-person workshops, or intensive bootcamps.
        </p>
    </div>
    <div class="col-md-6 col-lg-6 col-12">
        <!-- You can add an image, video, or anything here -->
    </div>
      
</div>

<div class="row mt-5 mb-5 p-5">
    <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
   <div class="col-lg-5 col-mg-5 col-12">
        <div class="custom-card ">
                <img src="{{ asset('images/cyber-security.jpg') }}" alt="Card Image" class="card-img-left">
                <div class="card-body">
                    <h4 class="card-title text-white">Cybersecurity</h4><br>
                    <p class="card-text text-white" style="font-size:13px">
                       Enhance your expertise across technical, functional, and managerial dimensions within the cybersecurity domain through our comprehensive upskilling initiatives.
                    </p>
                   
                </div>
            </div>
    </div>
    <div class="col-lg-5 col-mg-5 col-12">
         <div class="custom-card ">
                <img src="{{ asset('images/privacy.jpg') }}" alt="Card Image" class="card-img-left">
                <div class="card-body text-white">
                    <h4 class="card-title text-white">Privacy and legal</h4><br>
                    <p class="card-text text-white" style="font-size:13px">
                       Elevate your comprehension of the legal ramifications concerning data and infrastructure security, and how they align with cybersecurity measures through specialized upskilling efforts.
                    </p>
                   
                </div>
            </div>
        
    </div>
    <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
    
</div><br>
<div class="row mt-5 mb-5 align-items-center p-5">
    <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
    <div class="col-lg-2 col-md-2 col-12 text-center">
        <img src="{{ asset('images/svg-image-1.svg') }}" style="width:90%">
    </div>
   <div class="col-lg-8 col-md-8 col-12 text-center">
        <h1 class="text-black" style="line-height:1.5">We leverage our expertise and resources to help you excel in the field and distinguish yourself as a standout professional.</h1>
        <p class="mt-5 text-black" style="line-height:1.5">In addition to personalized training, we offer ongoing mentorship and access to cutting-edge industry insights, ensuring you remain at the forefront of cybersecurity and privacy advancements. Our comprehensive curriculum covers emerging technologies, regulatory frameworks, and best practices, equipping you with the skills needed to thrive in today's dynamic digital landscape.</p>
    </div>
       <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
</div>

<style>
    .content{
    margin-top:40px;    
}
.plan-one {
    margin: 0 0 20px 0;
    width: 100%;
    position: relative;
}

.plan-card {
    background: #fff;
    margin-bottom: 30px;
    transition: .5s;
    border: 0;
    border-radius: .55rem;
    position: relative;
    width: 100%;
    box-shadow: 0 1px 2px 0 rgba(0,0,0,0.5);
}

.plan-one .pricing-header {
    padding: 0;
    margin-bottom: 0;
    text-align: center;
}

.plan-one .pricing-header .plan-title {
    -webkit-border-radius: 10px 10px 0px 0px;
    -moz-border-radius: 10px 10px 0px 0px;
    border-radius: 10px 10px 0px 0px;
    font-size: 1.2rem;
    color: #ffffff;
    padding: 10px 0;
    font-weight: 600;
    background: #5a99ee;
    margin: 0;
}

.plan-one .pricing-header .plan-cost {
    color: #ffffff;
    background: #71a7f0;
    padding: 15px 0;
    font-size: 2.5rem;
    font-weight: 700;
}

.plan-one .pricing-header .plan-save {
    color: #ffffff;
    background: #84b3f2;
    padding: 10px 0;
    font-size: 1rem;
    font-weight: 700;
}

.plan-one .pricing-header.green .plan-title {
    background: #47BCC7;
}

.plan-one .pricing-header.green .plan-cost {
    background: #5bc3cd;
}

.plan-one .pricing-header.green .plan-save {
    background: #6ac9d2;
}

.plan-one .pricing-header.orange .plan-title {
    background: #fc8165;
}

.plan-one .pricing-header.orange .plan-cost {
    background: #fd967e;
}

.plan-one .pricing-header.orange .plan-save {
    background: #fdaa97;
}

.plan-one .plan-features {
    border: 1px solid #e6ecf3;
    border-top: 0;
    border-bottom: 0;
    padding: 0;
    margin: 0;
    text-align: left;
}

.plan-one .plan-features li {
    padding: 10px 15px 10px 40px;
    margin: 5px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    position: relative;
    border-bottom: 1px solid #e6ecf3;
    line-height: 100%;
}

.plan-one .plan-footer {
    border: 1px solid #e6ecf3;
    border-top: 0;
    background: #ffffff;
    -webkit-border-radius: 0 0 10px 10px;
    -moz-border-radius: 0 0 10px 10px;
    border-radius: 0 0 10px 10px;
    text-align: center;
    padding: 10px 0 30px 0;
}

@media (max-width: 767px) {
    .plan-one .pricing-header {
        text-align: center;
    }
    .plan-one .pricing-header i {
        display: block;
        float: none;
        margin-bottom: 20px;
    }
}
</style>
@php
$pricetable=DB::table('pricing_plans')->orderBy('sort_order', 'asc')->get();
@endphp
<div class="container content">
<div class="row gutters">
    @foreach($pricetable as $pricetabl)
	<div class="col-lg-4 col-md-4 col-sm-12">
		<div class="plan-card plan-one">
			<div class="pricing-header">
			    @if($pricetabl->title_type == 'text')
				<h4 class="plan-title">{{$pricetabl->title}}</h4>
				@else 
				<center><img src="{{asset($pricetabl->title)}}" height="35"></center>
				@endif
				<div class="plan-cost">{{$pricetabl->price}}</div>
				<!--<div class="plan-save">Save $29.00</div>-->
			</div>
			<ul class="plan-features">
			
				@foreach (explode('|', $pricetabl->features) as $feature)
                    <li>{{ $feature }}</li>
                @endforeach
				
			</ul>
			<div class="plan-footer">
				<a href="{{$pricetabl->button_link}}" class="btn btn-info btn-lg btn-rounded text-white">{{$pricetabl->button_text}}</a>
			</div>
		</div>
	</div>
	@endforeach

</div>
</div>
<div class="container mb-5">
    <h3 class="text-center">“Access our library and courses” - Sign Up using your gmail, linkedin, etc (LMS <a href="https://lms.cybergoat.ae/login" class="text-info">Login</a>)</h3>
    
</div>
{{-- To make a editable image or text need to be add a "builder editable" class and builder identity attribute with a unique value --}}
{{-- "builder identity" and "builder editable" --}}
{{-- builder identity value have to be unique under a single file --}}

<section class="testimonials-wrapper section-padding">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-5 col-md-6">
                <div class="skill-image position-relative">
                    <img class="builder-editable" src="{{asset('assets/frontend/default/image/skill-image.png')}}" alt="...">
                    <div class="over-text">
                        <span>
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.12494 20.0241C9.16021 20.0241 10.1674 20.1415 11.1466 20.3763C12.1258 20.6111 13.0977 20.9793 14.0625 21.4809V9.19239C13.1843 8.62028 12.2339 8.1912 11.2115 7.90514C10.1891 7.61907 9.16021 7.47604 8.12494 7.47604C7.37494 7.47604 6.67422 7.53493 6.02278 7.6527C5.37134 7.77049 4.70188 7.9632 4.01438 8.23082C3.91821 8.26289 3.85009 8.30897 3.81003 8.36907C3.76997 8.42918 3.74994 8.49528 3.74994 8.56739V20.3895C3.74994 20.5017 3.79 20.5838 3.87013 20.6359C3.95027 20.688 4.03843 20.694 4.13459 20.6539C4.72753 20.452 5.35332 20.2966 6.01197 20.1876C6.67061 20.0786 7.37494 20.0241 8.12494 20.0241ZM15.9374 21.4809C16.9022 20.9793 17.8741 20.6111 18.8533 20.3763C19.8324 20.1415 20.8397 20.0241 21.8749 20.0241C22.6249 20.0241 23.3293 20.0786 23.9879 20.1876C24.6466 20.2966 25.2723 20.452 25.8653 20.6539C25.9614 20.694 26.0496 20.688 26.1297 20.6359C26.2099 20.5838 26.2499 20.5017 26.2499 20.3895V8.56739C26.2499 8.49528 26.2299 8.43118 26.1898 8.37507C26.1498 8.31897 26.0817 8.27089 25.9855 8.23082C25.298 7.9632 24.6285 7.77049 23.9771 7.6527C23.3257 7.53493 22.6249 7.47604 21.8749 7.47604C20.8397 7.47604 19.8108 7.61907 18.7884 7.90514C17.7659 8.1912 16.8156 8.62028 15.9374 9.19239V21.4809ZM14.9999 23.7068C14.7564 23.7068 14.5284 23.6763 14.3161 23.6154C14.1037 23.5545 13.903 23.4736 13.7139 23.3726C12.8533 22.8854 11.9531 22.5181 11.0132 22.2704C10.0733 22.0229 9.11052 21.8991 8.12494 21.8991C7.36212 21.8991 6.61294 21.9836 5.87738 22.1527C5.14179 22.3217 4.43266 22.5705 3.74997 22.899C3.30447 23.1042 2.88059 23.0717 2.47834 22.8017C2.07611 22.5317 1.875 22.149 1.875 21.6539V8.08183C1.875 7.8126 1.9443 7.55979 2.08291 7.32342C2.22153 7.08704 2.42146 6.91677 2.68269 6.8126C3.52883 6.40075 4.41064 6.09587 5.32809 5.89795C6.24555 5.70003 7.17783 5.60107 8.12494 5.60107C9.34129 5.60107 10.5296 5.76734 11.6898 6.09989C12.8501 6.43241 13.9535 6.92319 14.9999 7.57223C16.0464 6.92319 17.1498 6.43241 18.31 6.09989C19.4703 5.76734 20.6586 5.60107 21.8749 5.60107C22.822 5.60107 23.7543 5.70003 24.6718 5.89795C25.5892 6.09587 26.471 6.40075 27.3172 6.8126C27.5784 6.91677 27.7783 7.08704 27.917 7.32342C28.0556 7.55979 28.1249 7.8126 28.1249 8.08183V21.6539C28.1249 22.149 27.9158 22.5276 27.4975 22.7897C27.0792 23.0517 26.6393 23.0801 26.1778 22.875C25.5031 22.5545 24.804 22.3117 24.0804 22.1467C23.3569 21.9816 22.6217 21.8991 21.8749 21.8991C20.8894 21.8991 19.9266 22.0229 18.9867 22.2704C18.0468 22.5181 17.1466 22.8854 16.286 23.3726C16.0969 23.4736 15.8961 23.5545 15.6838 23.6154C15.4715 23.6763 15.2435 23.7068 14.9999 23.7068ZM17.4278 11.077C17.4278 10.9376 17.4775 10.795 17.5768 10.6491C17.6762 10.5033 17.7892 10.4031 17.9158 10.3487C18.536 10.1003 19.1742 9.91195 19.8305 9.78376C20.4867 9.65555 21.1682 9.59145 21.8749 9.59145C22.2836 9.59145 22.679 9.61548 23.0612 9.66354C23.4434 9.71163 23.8284 9.77733 24.2163 9.86067C24.3637 9.89431 24.4911 9.97444 24.5985 10.101C24.7058 10.2276 24.7595 10.3751 24.7595 10.5434C24.7595 10.8254 24.671 11.0317 24.4939 11.1623C24.3168 11.2929 24.0873 11.3246 23.8052 11.2573C23.5056 11.1948 23.1943 11.1499 22.8713 11.1227C22.5484 11.0954 22.2163 11.0818 21.8749 11.0818C21.2692 11.0818 20.6758 11.1399 20.0949 11.2561C19.5139 11.3723 18.9598 11.5297 18.4326 11.7284C18.1377 11.8422 17.8966 11.8358 17.7091 11.7092C17.5216 11.5826 17.4278 11.3719 17.4278 11.077ZM17.4278 17.9039C17.4278 17.7645 17.4775 17.6199 17.5768 17.47C17.6762 17.3202 17.7892 17.218 17.9158 17.1635C18.5199 16.9151 19.1582 16.7289 19.8305 16.6047C20.5027 16.4805 21.1842 16.4184 21.8749 16.4184C22.2836 16.4184 22.679 16.4424 23.0612 16.4905C23.4434 16.5385 23.8284 16.6042 24.2163 16.6876C24.3637 16.7212 24.4911 16.8014 24.5985 16.928C24.7058 17.0546 24.7595 17.202 24.7595 17.3703C24.7595 17.6523 24.671 17.8586 24.4939 17.9892C24.3168 18.1198 24.0873 18.1515 23.8052 18.0842C23.5056 18.0217 23.1943 17.9768 22.8713 17.9496C22.5484 17.9223 22.2163 17.9087 21.8749 17.9087C21.2772 17.9087 20.6898 17.9656 20.1129 18.0794C19.536 18.1932 18.9839 18.3534 18.4567 18.5602C18.1618 18.682 17.9166 18.6788 17.7211 18.5505C17.5256 18.4223 17.4278 18.2068 17.4278 17.9039ZM17.4278 14.5025C17.4278 14.3631 17.4775 14.2204 17.5768 14.0746C17.6762 13.9288 17.7892 13.8286 17.9158 13.7741C18.536 13.5257 19.1742 13.3374 19.8305 13.2092C20.4867 13.081 21.1682 13.0169 21.8749 13.0169C22.2836 13.0169 22.679 13.041 23.0612 13.089C23.4434 13.1371 23.8284 13.2028 24.2163 13.2861C24.3637 13.3198 24.4911 13.3999 24.5985 13.5265C24.7058 13.6531 24.7595 13.8006 24.7595 13.9688C24.7595 14.2509 24.671 14.4572 24.4939 14.5878C24.3168 14.7184 24.0873 14.7501 23.8052 14.6828C23.5056 14.6203 23.1943 14.5754 22.8713 14.5481C22.5484 14.5209 22.2163 14.5073 21.8749 14.5073C21.2692 14.5073 20.6758 14.5654 20.0949 14.6815C19.5139 14.7977 18.9598 14.9552 18.4326 15.1539C18.1377 15.2677 17.8966 15.2613 17.7091 15.1347C17.5216 15.0081 17.4278 14.7974 17.4278 14.5025Z"
                                    fill="white" />
                            </svg>

                        </span>
                        <div class="b-text">
                            <h5 class="builder-editable" >150k +</h5>
                            <p class="builder-editable" >Top rated Courses</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7 col-md-6">
                <div class="skil-content">
                    <span class="title-head builder-editable" >Know About Us</span>
                   
                    <p class="description mt-5 builder-editable" >
                        Our organization is comprised of leading cybersecurity and privacy experts driven by a shared mission: to empower aspiring professionals with high-quality, cost-effective education. We recognize the challenges of navigating the cybersecurity field, as we have successfully traversed this path ourselves. Our commitment lies in equipping learners with the knowledge and skills necessary to thrive in this dynamic industry. We provide:
                    </p>
                    <ul>
                        <li>
                            <div class="svg">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21.4083 16.3111L24.8186 12.8896C24.9709 12.7356 25.1492 12.6585 25.3535 12.6585C25.5578 12.6585 25.7407 12.7356 25.9022 12.8896C26.0638 13.0437 26.1427 13.224 26.1389 13.4307C26.1352 13.6373 26.0563 13.8144 25.9022 13.962L22.059 17.7761C21.874 17.9676 21.6539 18.0633 21.3986 18.0633C21.1434 18.0633 20.92 17.9676 20.7286 17.7761L18.8978 15.9274C18.7437 15.7804 18.6648 15.6083 18.6611 15.4111C18.6573 15.2138 18.7362 15.0345 18.8978 14.8729C19.0518 14.7189 19.2324 14.64 19.4396 14.6362C19.6468 14.6325 19.8274 14.7114 19.9814 14.8729L21.4083 16.3111ZM10.628 21.9694C8.90488 20.4288 7.48318 19.0886 6.36289 17.9489C5.24258 16.8091 4.36009 15.7924 3.71543 14.8987C3.07077 14.005 2.62092 13.1891 2.36589 12.4509C2.1109 11.7128 1.9834 10.9653 1.9834 10.2085C1.9834 8.64995 2.51737 7.32997 3.58532 6.24857C4.65325 5.16717 5.95675 4.62646 7.49584 4.62646C8.47555 4.62646 9.41374 4.85495 10.3104 5.31191C11.2071 5.76885 11.9703 6.42286 12.6 7.27392C13.2355 6.42101 13.9837 5.76654 14.8444 5.31051C15.7051 4.85448 16.6195 4.62646 17.5875 4.62646C18.992 4.62646 20.2312 5.07706 21.3051 5.97825C22.379 6.87942 23.0072 8.01729 23.1897 9.39186H21.6417C21.4517 8.48544 20.9918 7.71737 20.2619 7.08766C19.532 6.45796 18.6405 6.1431 17.5875 6.1431C16.5016 6.1431 15.6491 6.42018 15.0298 6.97435C14.4106 7.52852 13.7614 8.23712 13.0824 9.10016H12.1176C11.4042 8.21019 10.7393 7.49486 10.1231 6.95417C9.50685 6.41346 8.6311 6.1431 7.49584 6.1431C6.37255 6.1431 5.42576 6.53386 4.65544 7.31537C3.88515 8.0969 3.50001 9.06128 3.50001 10.2085C3.50001 10.8259 3.62153 11.4525 3.86459 12.0883C4.10765 12.7242 4.56459 13.4688 5.23542 14.3221C5.90626 15.1754 6.82987 16.188 8.00626 17.3599C9.18265 18.5318 10.7139 19.9689 12.6 21.671C13.131 21.1983 13.8418 20.5589 14.7325 19.7527C15.6232 18.9465 16.2743 18.3475 16.6856 17.9556L16.8531 18.1232L17.2218 18.4918L17.5904 18.8605L17.758 19.028C17.3347 19.4393 16.9043 19.8421 16.4668 20.2362C16.0293 20.6303 15.6363 20.9859 15.2878 21.303L13.2215 23.1697C13.03 23.3222 12.8229 23.3985 12.6 23.3985C12.3772 23.3985 12.17 23.3222 11.9786 23.1697L10.628 21.9694Z"
                                        fill="#F81163" />
                                </svg>
                            </div>
                            <div class="skill-text">
                                <span class="builder-editable" >Expert-led training delivered by certified instructors with an average of 10+ years of practical and pedagogical experience.</span>
                               
                                
                            </div>
                        </li>
                               <li>
                            <div class="svg">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21.4083 16.3111L24.8186 12.8896C24.9709 12.7356 25.1492 12.6585 25.3535 12.6585C25.5578 12.6585 25.7407 12.7356 25.9022 12.8896C26.0638 13.0437 26.1427 13.224 26.1389 13.4307C26.1352 13.6373 26.0563 13.8144 25.9022 13.962L22.059 17.7761C21.874 17.9676 21.6539 18.0633 21.3986 18.0633C21.1434 18.0633 20.92 17.9676 20.7286 17.7761L18.8978 15.9274C18.7437 15.7804 18.6648 15.6083 18.6611 15.4111C18.6573 15.2138 18.7362 15.0345 18.8978 14.8729C19.0518 14.7189 19.2324 14.64 19.4396 14.6362C19.6468 14.6325 19.8274 14.7114 19.9814 14.8729L21.4083 16.3111ZM10.628 21.9694C8.90488 20.4288 7.48318 19.0886 6.36289 17.9489C5.24258 16.8091 4.36009 15.7924 3.71543 14.8987C3.07077 14.005 2.62092 13.1891 2.36589 12.4509C2.1109 11.7128 1.9834 10.9653 1.9834 10.2085C1.9834 8.64995 2.51737 7.32997 3.58532 6.24857C4.65325 5.16717 5.95675 4.62646 7.49584 4.62646C8.47555 4.62646 9.41374 4.85495 10.3104 5.31191C11.2071 5.76885 11.9703 6.42286 12.6 7.27392C13.2355 6.42101 13.9837 5.76654 14.8444 5.31051C15.7051 4.85448 16.6195 4.62646 17.5875 4.62646C18.992 4.62646 20.2312 5.07706 21.3051 5.97825C22.379 6.87942 23.0072 8.01729 23.1897 9.39186H21.6417C21.4517 8.48544 20.9918 7.71737 20.2619 7.08766C19.532 6.45796 18.6405 6.1431 17.5875 6.1431C16.5016 6.1431 15.6491 6.42018 15.0298 6.97435C14.4106 7.52852 13.7614 8.23712 13.0824 9.10016H12.1176C11.4042 8.21019 10.7393 7.49486 10.1231 6.95417C9.50685 6.41346 8.6311 6.1431 7.49584 6.1431C6.37255 6.1431 5.42576 6.53386 4.65544 7.31537C3.88515 8.0969 3.50001 9.06128 3.50001 10.2085C3.50001 10.8259 3.62153 11.4525 3.86459 12.0883C4.10765 12.7242 4.56459 13.4688 5.23542 14.3221C5.90626 15.1754 6.82987 16.188 8.00626 17.3599C9.18265 18.5318 10.7139 19.9689 12.6 21.671C13.131 21.1983 13.8418 20.5589 14.7325 19.7527C15.6232 18.9465 16.2743 18.3475 16.6856 17.9556L16.8531 18.1232L17.2218 18.4918L17.5904 18.8605L17.758 19.028C17.3347 19.4393 16.9043 19.8421 16.4668 20.2362C16.0293 20.6303 15.6363 20.9859 15.2878 21.303L13.2215 23.1697C13.03 23.3222 12.8229 23.3985 12.6 23.3985C12.3772 23.3985 12.17 23.3222 11.9786 23.1697L10.628 21.9694Z"
                                        fill="#F81163" />
                                </svg>
                            </div>
                            <div class="skill-text">
                                <span class="builder-editable" >Personalized learning experiences through customized curriculum design and delivery.</span>
                                
                                
                            </div>
                        </li>
                               <li>
                            <div class="svg">
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M21.4083 16.3111L24.8186 12.8896C24.9709 12.7356 25.1492 12.6585 25.3535 12.6585C25.5578 12.6585 25.7407 12.7356 25.9022 12.8896C26.0638 13.0437 26.1427 13.224 26.1389 13.4307C26.1352 13.6373 26.0563 13.8144 25.9022 13.962L22.059 17.7761C21.874 17.9676 21.6539 18.0633 21.3986 18.0633C21.1434 18.0633 20.92 17.9676 20.7286 17.7761L18.8978 15.9274C18.7437 15.7804 18.6648 15.6083 18.6611 15.4111C18.6573 15.2138 18.7362 15.0345 18.8978 14.8729C19.0518 14.7189 19.2324 14.64 19.4396 14.6362C19.6468 14.6325 19.8274 14.7114 19.9814 14.8729L21.4083 16.3111ZM10.628 21.9694C8.90488 20.4288 7.48318 19.0886 6.36289 17.9489C5.24258 16.8091 4.36009 15.7924 3.71543 14.8987C3.07077 14.005 2.62092 13.1891 2.36589 12.4509C2.1109 11.7128 1.9834 10.9653 1.9834 10.2085C1.9834 8.64995 2.51737 7.32997 3.58532 6.24857C4.65325 5.16717 5.95675 4.62646 7.49584 4.62646C8.47555 4.62646 9.41374 4.85495 10.3104 5.31191C11.2071 5.76885 11.9703 6.42286 12.6 7.27392C13.2355 6.42101 13.9837 5.76654 14.8444 5.31051C15.7051 4.85448 16.6195 4.62646 17.5875 4.62646C18.992 4.62646 20.2312 5.07706 21.3051 5.97825C22.379 6.87942 23.0072 8.01729 23.1897 9.39186H21.6417C21.4517 8.48544 20.9918 7.71737 20.2619 7.08766C19.532 6.45796 18.6405 6.1431 17.5875 6.1431C16.5016 6.1431 15.6491 6.42018 15.0298 6.97435C14.4106 7.52852 13.7614 8.23712 13.0824 9.10016H12.1176C11.4042 8.21019 10.7393 7.49486 10.1231 6.95417C9.50685 6.41346 8.6311 6.1431 7.49584 6.1431C6.37255 6.1431 5.42576 6.53386 4.65544 7.31537C3.88515 8.0969 3.50001 9.06128 3.50001 10.2085C3.50001 10.8259 3.62153 11.4525 3.86459 12.0883C4.10765 12.7242 4.56459 13.4688 5.23542 14.3221C5.90626 15.1754 6.82987 16.188 8.00626 17.3599C9.18265 18.5318 10.7139 19.9689 12.6 21.671C13.131 21.1983 13.8418 20.5589 14.7325 19.7527C15.6232 18.9465 16.2743 18.3475 16.6856 17.9556L16.8531 18.1232L17.2218 18.4918L17.5904 18.8605L17.758 19.028C17.3347 19.4393 16.9043 19.8421 16.4668 20.2362C16.0293 20.6303 15.6363 20.9859 15.2878 21.303L13.2215 23.1697C13.03 23.3222 12.8229 23.3985 12.6 23.3985C12.3772 23.3985 12.17 23.3222 11.9786 23.1697L10.628 21.9694Z"
                                        fill="#F81163" />
                                </svg>
                            </div>
                            <div class="skill-text">
                                <span class="builder-editable" >A comprehensive training framework, including:</span>
                                <p class="builder-editable" >Targeted Subject-Specific Training
                                </p>
                                 <p class="builder-editable" >Industry-Recognized Certification Programs
                                </p>
                                 <p class="builder-editable" >Bespoke Training Solutions for Teams and Organizations (Webinars and Classroom Sessions)
                                </p>
                            </div>
                        </li>
               
                    </ul>
                    <a href="{{ route('about.us') }}" class="eBtn gradient mt-50 mb-5 builder-editable" >More about us <i class="fa-solid fa-arrow-right-long ms-2"></i></a>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
        .cards {
            position: relative;
            overflow: hidden;
            border-radius:20px;
            
        }
        .card-img-overlay {
            background: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        }
        .cards:hover .card-img-overlay {
            opacity: 1;
        }
        .card-title
        {
            font-size:1.5rem;
        }
        
        @media (min-width: 675.98px) {
   .cards {
           
            min-height:400px;
        }
}
    </style>
<div class="container-fluid mt-5 p-5">
    <div class="row justify-content-center">
        <div class="col-md-3 col-lg-3 col-6 mt-5 ">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/CybersecurityFundamentals.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Cybersecurity Fundamentals
        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal1">Explore</button>
        </div>      
        </div>
                 
        </div>
        
             <div class="col-md-3 col-lg-3 col-6 mt-5 ">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/InformationPrivacyFundamentals.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Information Privacy Fundamentals

        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal2">Explore</button>
        </div>      
        </div>
                 
        </div>
        
             <div class="col-md-3 col-lg-3 col-6 mt-5 ">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/EthicalHackingFundamentals.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Ethical Hacking Fundamentals

        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal3">Explore</button>
        </div>      
        </div>
                 
        </div>
        
             <div class="col-md-3 col-lg-3 col-6 mt-5 ">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/ApplicationSecurityAdvanced.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Application Security – Advanced

        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal4">Explore</button>
        </div>      
        </div>
                 
        </div>
        
             <div class="col-md-3 col-lg-3 col-6 mt-5">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/VulnerabilityAssessmentPenetrationTestingAdvanced.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Vulnerability Assessment & Penetration testing – Advanced

        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal5">Explore</button>
        </div>      
        </div>
                 
        </div>
        
             <div class="col-md-3 col-lg-3 col-6 mt-5 ">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/RiskManagementAdvanced.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Risk Management – Advanced

        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal6">Explore</button>
        </div>      
        </div>
                 
        </div>
        
             <div class="col-md-3 col-lg-3 col-6 mt-5">
            
                    <div class="card cards bg-dark" style="width: 100%;">
          <img class="card-img-top" src="{{ asset('images/NetworkSecurityAdvanced.jpeg') }}" >
          <div class="card-body">
              
            <p class="card-title text-center text-white">Network Security – Advanced

        </p>
          </div>
          <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center text-white">
               <button class="btn btn-lg bg-dark text-white mt-3" data-bs-toggle="modal" data-bs-target="#exploreModal7">Explore</button>
        </div>      
        </div>
                 
        </div>
        
        
        

    </div>
</div>
<div class="modal modal-lg fade" id="exploreModal1" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Cybersecurity Fundamentals
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/CybersecurityFundamentals.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
                   
               The course material for Cybersecurity fundamentals typically includes an introduction to basic concepts and principles of cybersecurity, such as understanding the threat landscape, including various types of malware and attack vectors. It covers essential topics like network security, encryption, and secure communications, as well as access control mechanisms and authentication methods. The curriculum often explores risk management, including identifying vulnerabilities and implementing mitigation strategies. It also addresses the importance of compliance with legal and regulatory standards, ethical considerations in cybersecurity, and incident response planning and procedures. Additionally, practical skills are developed through hands-on exercises and labs focusing on using cybersecurity tools and techniques.</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-lg fade" id="exploreModal2" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Information Privacy Fundamentals
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/InformationPrivacyFundamentals.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
                   
               The course material for Information Privacy fundamentals encompasses an overview of privacy principles and frameworks, emphasizing the importance of data protection and individual privacy rights. It includes topics such as the types of personal data, data lifecycle management, and techniques for data anonymization and encryption. The curriculum addresses global privacy laws and regulations, such as GDPR and CCPA, and their implications for organizations. It covers privacy impact assessments, the role of privacy policies, and strategies for implementing privacy by design. Additionally, the course explores the ethical aspects of information privacy, data breach response protocols, and best practices for maintaining privacy in both digital and physical environments. Practical exercises and case studies are often used to illustrate real-world applications of privacy concepts and compliance strategies.
</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-lg fade" id="exploreModal3" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Ethical Hacking Fundamentals
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/EthicalHackingFundamentals.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
                   
              The course material for Ethical Hacking fundamentals includes a comprehensive introduction to ethical hacking concepts and the role of an ethical hacker. It covers various phases of ethical hacking, such as reconnaissance, scanning, enumeration, gaining access, maintaining access, and covering tracks. The curriculum delves into network and system vulnerabilities, different types of cyber- attacks, and the tools and techniques used to exploit these vulnerabilities in a controlled and lawful manner. Key topics include penetration testing methodologies, web application security, wireless network security, and cryptography. The course also emphasizes the legal and ethical responsibilities of ethical hackers, along with best practices for documenting and reporting findings. Hands-on labs and practical exercises are integral, providing students with real-world experience in identifying and mitigating security threats.
</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-lg fade" id="exploreModal4" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Application Security – Advanced
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/ApplicationSecurityAdvanced.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
                   
              The course material for Advanced Application Security delves deeply into the methodologies and practices required to secure software applications throughout their lifecycle. It covers advanced topics such as secure coding practices, threat modeling, and secure software development frameworks. The curriculum includes an in-depth exploration of common and emerging vulnerabilities like SQL injection, cross-site scripting (XSS), and remote code execution, along with techniques for detecting and mitigating these threats. It emphasizes the importance of application security testing, including static and dynamic analysis, as well as automated and manual testing approaches. The course also addresses secure API development, mobile application security, and the integration of security into DevOps practices (DevSecOps). Practical components involve hands-on labs and real-world scenarios to reinforce concepts, enabling students to design, develop, and maintain secure applications effectively.
</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-lg fade" id="exploreModal5" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Vulnerability Assessment & Penetration testing – Advanced
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/VulnerabilityAssessmentPenetrationTestingAdvanced.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
               The course material for Advanced Vulnerability Assessment and Penetration Testing (VAPT) focuses on sophisticated techniques and tools used to identify, analyze, and exploit security vulnerabilities in networks, systems, and applications. It covers advanced methodologies for conducting comprehensive vulnerability assessments, including network scanning, system enumeration, and exploit development. The curriculum includes detailed modules on penetration testing phases such as pre-engagement interactions, intelligence gathering, threat modeling, and vulnerability analysis. Students learn to perform advanced exploitation techniques, post-exploitation strategies, and persistence mechanisms, alongside evasion techniques to bypass security defenses. The course emphasizes reporting and documentation best practices, ensuring ethical and legal considerations are adhered to throughout the testing process. Practical labs and real-world scenarios provide handson experience with industry-standard tools and techniques, preparing students to conduct thorough and effective VAPT engagements.
</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-lg fade" id="exploreModal6" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Risk Management – Advanced
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/RiskManagementAdvanced.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
                   
              The course material for Advanced Security Risk Management encompasses comprehensive strategies and methodologies for identifying, assessing, and mitigating security risks within an organization. It covers advanced risk assessment techniques, including quantitative and qualitative risk analysis, threat modeling, and the use of risk management frameworks such as NIST, ISO 31000 and ISO/IEC 27005. The curriculum delves into the development and implementation of risk management policies, procedures, and controls, as well as the integration of risk management into enterprise governance structures. Key topics include incident response planning, business continuity and disaster recovery planning, and the role of security metrics and key risk indicators in monitoring and managing risk. Practical components involve case studies and real-world scenarios to illustrate effective risk management practices and decision-making processes, ensuring that students can develop and implement robust security risk management programs tailored to their organization's specific needs.
</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-lg fade" id="exploreModal7" tabindex="-1" aria-labelledby="exploreModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title" id="exploreModalLabel">Network Security – Advanced
</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <center><img src="{{ asset('images/NetworkSecurityAdvanced.jpeg') }}" style="width:200px;margin:15px 0 15px 0;border-radius:10px"></center>
                
               <p>
                   
               The course material for Advanced Network Security focuses on the intricate aspects of securing complex network infrastructures against sophisticated threats. It includes in-depth coverage of network security architecture, advanced firewall and intrusion detection/prevention system (IDS/IPS) configurations, and the implementation of robust access control mechanisms. The curriculum explores secure network design principles, advanced encryption techniques, and the deployment of Virtual Private Networks (VPNs) for secure communication. Students learn about the latest threats and attack vectors, including Advanced Persistent Threats (APTs), and the corresponding mitigation strategies. The course also addresses network monitoring and traffic analysis, incident response, and forensic investigation techniques. Practical labs and hands-on exercises with industry-standard tools provide students with real-world experience in protecting network environments, ensuring they can effectively design, implement, and manage advanced network security solutions.
</p>

            </div>
            <div class="modal-footer d-flex justify-content-center">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<br>
<div class="row mt-5 mb-5 align-items-center p-5">
    <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
    <div class="col-lg-2 col-md-2 col-12 text-center">
        <img src="{{ asset('images/svg-image-2.svg') }}" style="width:90%">
    </div>
   <div class="col-lg-8 col-md-8 col-12 text-center">
        <h1 class="text-black" style="line-height:1.5">Being your mentor throughout your journey of cyber security.</h1>
        <p class="mt-5 text-black" style="line-height:1.5">CyberGOAT platform will be your mentor throughout your certification journey right from sourcing the material to passing the exam and receiving the badge.
</p>
    </div>
       <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
</div>

<div class="row mt-5 mb-5 align-items-center p-5">
    <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
    <div class="col-lg-2 col-md-2 col-12 text-center">
        <img src="{{ asset('images/grc.png') }}" style="width:90%">
    </div>
   <div class="col-lg-8 col-md-8 col-12 text-center">
        <h1 class="text-black" style="line-height:1.5">GRC Interpretation
</h1>
        <p class="mt-5 text-black" style="line-height:1.5">With rising trends in technologies, threats, there is increase in regulations world-wide. We have many new regulations and laws being enforced by the government in public safety and security. We help you interpreting these regulations and compliance requirements sector-specific and organization-specific. We help you simplify the understanding of each of these regulations in its entirety and in related to other compliance laws.

</p>
<h4 class="text-center mt-5" style="color:#fb8b23">Few examples of these include:
</h4>
<div class="m-2">
    <button class="btn btn-white border rounded-pill m-2 p-2">UAE Data Privacy Law</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">DESC ISR</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">GDPR</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">NIS2</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">DORA</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">GDPR + NIS2 + DORA
</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">GenAI + Privacy rules</button>
    <button class="btn btn-white border rounded-pill m-2 p-2">AI and trending technologies specific compliance requirements</button>
    

</div>
    </div>
       <div class="col-lg-1 col-mg-1 col-12">
        
    </div>
</div>


@include('components.home_made_by_builder.newmodal')

<div class="row mt-5 mb-5 align-items-center p-5">
     <div  class="col-lg-1 col-md-1 col-12 text-center">
         </div>
    <div  class="col-lg-5 col-md-5 col-12 text-center">
           <img src="{{ asset('images/svg-image-3.svg') }}" style="width:90%">
    </div>
    <div class="col-lg-5 col-md-5 col-12">
         <h1 class="text-black" style="line-height:1.2">Who we are?
</h1>
        <p class="mt-3 text-black" style="line-height:1.5">CyberGOAT empowers individuals and businesses to navigate the ever-shifting landscape of and privacy. In a world where regulations scramble to keep pace with emerging technologies like AI, CyberGOAT's training solutions provide a critical edge. Their programs not only educate users on best practices and raise privacy awareness, but also equip them with the skills to build successful careers in cybersecurity. Additionally, CyberGOAT offers customizable training designed to scale and future-proof the security posture of businesses across all industries.


</p>
    </div>
    <div  class="col-lg-1 col-md-1 col-12 text-center">
         </div>
</div>  

<div class="row mt-5 mb-5 align-items-center p-5">
     <div  class="col-lg-1 col-md-1 col-12 text-center">
         </div>
    <div  class="col-lg-5 col-md-5 col-12 ">
      <h1 class="text-black" style="line-height:1.2">Our strategy
</h1>

           <center><img src="{{ asset('images/svg-image-3.svg') }}" style="width:90%"></center>
           <p class="mt-3 text-black" style="line-height:1.5">Our strategy, involves pre-consultation and understand the training needs, customise the courses as best suitable for the individual’s or entity’s objectives and ensure best-in-class training solutions provided with assessments and certifications.




</p>
    </div>
    <style>
        .cusbut
        {
            
 display: inline-block;
    border-radius: 12px;
    color: #21323e;
    background: #324b5f1a;
    padding: 10px;
    overflow: hidden;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
   
        }
    </style>
    <div class="col-lg-6 col-md-6 col-12 text-center">
      <div class="cusbut text-center">Market Analysis - Technologies, Laws, Regulations, Industry needs</div>
      <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Develop training courses per the analysis</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">User preconsultion and understand the objectives</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Customise the training requirements aligned with user objectives</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Conduct preassessments</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Provide the training</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Conduct postassessments</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Provide exam vouchers for the applicable courses</div>
         <div class="text-center m-1" style="font-size:10px"><i class="fa-solid fa-diamond"></i></div>
       <div class="cusbut text-center">Get certified</div>
    
    </div>
    <div  class="col-lg-1 col-md-1 col-12 text-center">
         </div>
</div>  
    
    
    <div class="row mt-5 mb-5 align-items-center p-5">
     <div  class="col-lg-1 col-md-1 col-12 text-center">
         </div>
    <div  class="col-lg-5 col-md-5 col-12 text-center">
           <center><img src="{{ asset('images/Screenshot 2025-03-30 174709.png') }}" style="width:90%"></center>
    </div>
    <div  class="col-lg-5 col-md-5 col-12 text-center">
            <center><img src="{{ asset('images/Screenshot 2025-03-30 174730.png') }}" style="width:90%"></center>
    </div>
   
    <div  class="col-lg-1 col-md-1 col-12 text-center">
         </div>
</div> 

