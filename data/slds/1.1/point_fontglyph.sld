<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Font Glyph</se:Name>
    <UserStyle>
      <se:Name>Font Glyph</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name>Small populated New Yorks</se:Name>
          <se:PointSymbolizer>
            <se:Graphic>
              <se:Mark>
                <se:WellKnownName>ttf://My Font Name#0x0A23</se:WellKnownName>
                <se:Fill>
                  <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                  <se:SvgParameter name="fill-opacity">0.5</se:SvgParameter>
                </se:Fill>
                <se:Stroke>
                  <se:SvgParameter name="stroke">#0000FF</se:SvgParameter>
                  <se:SvgParameter name="stroke-opacity">0.7</se:SvgParameter>
                </se:Stroke>
              </se:Mark>
              <se:Opacity>1</se:Opacity>
              <se:Size>10</se:Size>
            </se:Graphic>
          </se:PointSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
