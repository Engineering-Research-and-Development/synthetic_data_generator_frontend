<script lang="ts">
	import '../app.css';
    import {Navbar, NavBrand, NavLi, NavUl, NavHamburger} from "flowbite-svelte";
	let { children } = $props();
</script>

<svelte:head>
    <title>ENG - Synthetic Data Generator</title>
</svelte:head>

<div class="h-screen w-screen overflow-auto bg-gray-800 flex items-center justify-center"
    style="background-image: url('Dark-Purple-Backgrounds.png');">

    <Navbar class="fixed top-0 bg-opacity-30 backdrop-blur-lg shadow-md">
        <NavBrand href="/">
            <img src="ENG-LOGO-LIGHT.png" class="me-3 h-6 sm:h-9" alt="Eng Logo" />
            <img src="ctw_white.png" class="h-16 sm:h-16" alt="Eng Logo" />
        </NavBrand>
        <NavHamburger />
        <NavUl>
            <NavLi class="text-white" href="/">Home</NavLi>
            <NavLi class="text-white" href="/settings">Settings</NavLi>
        </NavUl>
    </Navbar>

    <div class="bg-cover h-3/2 w-1/2">
        {@render children()}
    </div>
</div>
