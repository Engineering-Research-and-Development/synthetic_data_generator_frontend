<script>
    import {Navbar, NavBrand, NavHamburger, NavLi, NavUl} from "flowbite-svelte";
</script>

<Navbar class="fixed w-full bg-opacity-30 top-0 backdrop-blur-lg shadow-md z-50">
    <NavBrand href="#">
        <div class="flex items-center gap-4">
            <a href="https://www.eng.it">
                <img src="ENG-LOGO-LIGHT.png" class="h-6 sm:h-9" alt="ENG Logo"/>
            </a>
            <a href="https://www.circular-twain-project.eu/">
                <img src="ctw_white.png" class="h-10 sm:h-16" alt="Circular Twain Logo"/>
            </a>
        </div>
    </NavBrand>

    <NavHamburger />
    <NavUl>
        <NavLi class="text-white" href="/">Home</NavLi>
    </NavUl>
</Navbar>