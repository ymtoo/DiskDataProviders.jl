var documenterSearchIndex = {"docs":
[{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"(Image: Build Status) (Image: codecov)","category":"page"},{"location":"#DiskDataProviders-1","page":"DiskDataProviders","title":"DiskDataProviders","text":"","category":"section"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"using DiskDataProviders, Test, Serialization, MLDataUtils","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"This package implements datastructures that are iterable and backed by a buffer that is fed by data from disk. If Reading and preproccesing data is faster than one training step, it's recommended to use a ChannelDiskDataProvider, if the training step is fast but reading data takes long time, QueueDiskDataProvider is recommended. Both types do the reading on a separate thread, so make sure Julia is started with at least two threads.","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"Usage example","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"using DiskDataProviders, Test, Serialization, MLDataUtils\n\n# === Create some random example data ===\ndirpath = mktempdir()*\"/\"\nN = 100\nT = 500\nbatch_size = 2\nqueue_length = 5 # Length of the internal buffer.\nlabs = rand(1:5, N)\nfor i = 1:N\n    a = randn(T)\n    serialize(dirpath*\"$(i).bin\", (a, labs[i]))\nend\n\nfiles = dirpath .* string.(1:N) .* \".bin\"\n\n# === Create a DiskDataProvider ===\ndataset = ChannelDiskDataProvider{Vector{Float64}, Int}((T,), batch_size, queue_length; labels=labs, files=files)","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"The dataset is iterable and can be used in loops etc. One can also create a BatchView, which is an iterator over batches. The batch size is defined when the DiskDataProvider is created.","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"# === Example usage of the provider ===\ndatasett, datasetv = stratifiedobs(dataset, 0.75)\n\nsort(dataset.ulabels) == 1:5\n\nx,y = first(dataset) # Get one datapoint\n\nt = start_reading(dataset) # this function initiates the reading into the buffer\n\nwait(dataset) # Wait for the reading to start before proceeding\n\nbw = batchview(dataset);\n\nxb,yb = first(bw) # Get the first batch from the buffer\n\nfor (x,y) in bw # Iterate the batches in the batchview\n    # do something with the data\nend\n\nstop!(dataset) # Stop reading into the buffer","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"If your data has more dimensions than 1, e.g., inputs are matrices or 3d-tensors, you create a DiskDataProvider like this","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"dataset = ChannelDiskDataProvider((nrows,ncols,nchannels), batchsize, queuelength; labels=labs, files=files)","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"notice that you have to provide nchannels, which is 1 if the input is a matrix.","category":"page"},{"location":"#Preprocess-data-1","page":"DiskDataProviders","title":"Preprocess data","text":"","category":"section"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"All functionality in this package operates on serialized, preprocessed data files. Serialized files are fast to read, and storing already preprocessed data cuts down on overhead. This package does currently not support arbitrary file formats. The files are read using Julias built in deserializer.","category":"page"},{"location":"#Exported-functions-and-types-1","page":"DiskDataProviders","title":"Exported functions and types","text":"","category":"section"},{"location":"#Index-1","page":"DiskDataProviders","title":"Index","text":"","category":"section"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"","category":"page"},{"location":"#","page":"DiskDataProviders","title":"DiskDataProviders","text":"Modules = [DiskDataProviders]\nPrivate = false","category":"page"},{"location":"#DiskDataProviders.BufferedIterator","page":"DiskDataProviders","title":"DiskDataProviders.BufferedIterator","text":"struct BufferedIterator{T <: AbstractDiskDataProvider}\n\nCreates an iterator which uses the underlying buffer in the dataset.\n\n\n\n\n\n","category":"type"},{"location":"#DiskDataProviders.ChannelDiskDataProvider-Union{Tuple{YT}, Tuple{ChannelDiskDataProvider{#s44,YT,BT} where BT where #s44,AbstractArray}} where YT","page":"DiskDataProviders","title":"DiskDataProviders.ChannelDiskDataProvider","text":"ChannelDiskDataProvider(d::ChannelDiskDataProvider, inds::AbstractArray)\n\nThis constructor can be used to create a dataprovider that is a subset of another.\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.ChannelDiskDataProvider-Union{Tuple{YT}, Tuple{XT}, Tuple{Any,Any,Int64}} where YT where XT","page":"DiskDataProviders","title":"DiskDataProviders.ChannelDiskDataProvider","text":"ChannelDiskDataProvider{XT, YT}(xsize, batchsize, queuelength::Int; kwargs...) where {XT, YT}\n\nConstructor for ChannelDiskDataProvider. {XT, YT} are the types of the input and output respectively.\n\n#Arguments:\n\nxsize: Tuple with sixe of each data point\nbatchsize: how many datapoints to put in a batch\nqueuelength: length of buffer\nkwargs: to set the other fields of the structure.\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.QueueDiskDataProvider-Union{Tuple{YT}, Tuple{QueueDiskDataProvider{#s44,YT,BT} where BT where #s44,AbstractArray}} where YT","page":"DiskDataProviders","title":"DiskDataProviders.QueueDiskDataProvider","text":"QueueDiskDataProvider(d::QueueDiskDataProvider, inds::AbstractArray)\n\nThis constructor can be used to create a dataprovider that is a subset of another.\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.QueueDiskDataProvider-Union{Tuple{YT}, Tuple{XT}, Tuple{Any,Any,Int64}} where YT where XT","page":"DiskDataProviders","title":"DiskDataProviders.QueueDiskDataProvider","text":"QueueDiskDataProvider{XT, YT}(xsize, batchsize, queuelength::Int; kwargs...) where {XT, YT}\n\nConstructor for QueueDiskDataProvider.\n\n{XT, YT} are the types of the input and output respectively.\n\n#Arguments:\n\nxsize: Tuple with sixe of each data point\nbatchsize: how many datapoints to put in a batch\nqueuelength: length of buffer\nkwargs: to set the other fields of the structure.\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.UnbufferedIterator","page":"DiskDataProviders","title":"DiskDataProviders.UnbufferedIterator","text":"struct UnbufferedIterator{T <: AbstractDiskDataProvider}\n\nCreates an iterator which does not use the underlying buffer in the dataset.\n\n\n\n\n\n","category":"type"},{"location":"#DiskDataProviders.labels-Tuple{Any}","page":"DiskDataProviders","title":"DiskDataProviders.labels","text":"labels(d)\n\nReturn the labels in the dataset\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.sample_input-Tuple{Any,Any}","page":"DiskDataProviders","title":"DiskDataProviders.sample_input","text":"sample_input(d::AbstractDiskDataProvider, y)\n\nSample one input with label y from the dataset\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.sample_input-Tuple{Any}","page":"DiskDataProviders","title":"DiskDataProviders.sample_input","text":"sample_input(d::AbstractDiskDataProvider)\n\nSample one datapoint from the dataset\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.sample_label-Tuple{Any}","page":"DiskDataProviders","title":"DiskDataProviders.sample_label","text":"sample_label(d)\n\nSample a random label from the dataset\n\n\n\n\n\n","category":"method"},{"location":"#DiskDataProviders.start_reading-Tuple{DiskDataProviders.AbstractDiskDataProvider}","page":"DiskDataProviders","title":"DiskDataProviders.start_reading","text":"start_reading(d::AbstractDiskDataProvider)\n\nInitialize reading into the buffer. This function has to be called before the dataset is used. Reading will continue until you call stop! on the dataset. If the dataset is a ChannelDiskDataProvider, this is a non-issue.\n\n\n\n\n\n","category":"method"}]
}
