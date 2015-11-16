<?php get_header(); ?>

<navbar></navbar>
<div id="openaid-main" ui-view></div>

<a href="#" id="toTop">
  <span class="fa-stack fa-lg">
    <i class="fa fa-square fa-stack-2x"></i>
    <i class="fa fa-caret-up fa-stack-1x fa-inverse"></i>
  </span>
</a>


<div id="service_menu">
    <h2>Service menu right</h2>  
    <ul class="menu">
        <li class="first last leaf">
            <a href="http://www.rvo.nl" title="">
                Dutch
            </a>
        </li>
    </ul>  
</div>

<?php get_footer(); ?>